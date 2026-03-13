import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    PasswordResetRequest,
    PasswordResetResponse,
)
from app.services.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    revoke_refresh_token,
    verify_password,
    verify_refresh_token,
)
from app.services.email import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])

_COOKIE_NAME = "refresh_token"
_COOKIE_SECURE = settings.is_production          # HTTPS only in prod
_COOKIE_MAX_AGE = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=_COOKIE_SECURE,
        samesite="strict",
        max_age=_COOKIE_MAX_AGE,
        path="/auth",          # Cookie only sent to /auth/* routes
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=_COOKIE_NAME, path="/auth")


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
def login(request: Request, login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()

    # Same error for wrong email OR wrong password — prevents email enumeration
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token, expires_in = create_access_token(subject=user.id)
    refresh_token, _ = create_refresh_token(user_id=user.id, db=db)

    _set_refresh_cookie(response, refresh_token)

    return LoginResponse(access_token=access_token, expires_in=expires_in)


@router.post("/refresh", response_model=LoginResponse)
@limiter.limit("10/minute")
def refresh_token(
    request: Request,
    response: Response,
    refresh_token: str = Cookie(default=None, alias=_COOKIE_NAME),
    db: Session = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token",
        )

    user_id = verify_refresh_token(refresh_token, db)
    if not user_id:
        _clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        _clear_refresh_cookie(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Rotate: revoke old token, issue new pair
    revoke_refresh_token(refresh_token, db)
    access_token, expires_in = create_access_token(subject=user.id)
    new_refresh_token, _ = create_refresh_token(user_id=user.id, db=db)

    _set_refresh_cookie(response, new_refresh_token)

    return LoginResponse(access_token=access_token, expires_in=expires_in)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    refresh_token: str = Cookie(default=None, alias=_COOKIE_NAME),
    current_user: User = Depends(get_current_user),   # M-9: requires valid access token
    db: Session = Depends(get_db),
):
    if refresh_token:
        revoke_refresh_token(refresh_token, db)
    _clear_refresh_cookie(response)


@router.post("/password-reset/request", response_model=PasswordResetResponse)
@limiter.limit("3/15minutes")
def request_password_reset(request: Request, reset_data: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == reset_data.email).first()
    if user:
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False,  # noqa: E712
        ).delete()

        token = secrets.token_urlsafe(32)
        reset_token = PasswordResetToken(
            token=token,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        db.add(reset_token)
        db.commit()

        reset_url = f"{settings.FRONTEND_URL}/password-reset/confirm?token={token}"
        send_password_reset_email(user.email, reset_url)

    # Always return success to prevent email enumeration
    return PasswordResetResponse(
        message="If an account with that email exists, a reset link has been sent."
    )


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str


@router.post("/password-reset/confirm", response_model=PasswordResetResponse)
def confirm_password_reset(request: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == request.token,
            PasswordResetToken.used == False,  # noqa: E712
        )
        .first()
    )

    if not reset_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    if reset_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")

    _validate_password_strength(request.new_password)

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = hash_password(request.new_password)
    reset_token.used = True
    db.commit()

    return PasswordResetResponse(message="Password reset successfully. You can now log in.")


def _validate_password_strength(password: str) -> None:
    """Raise HTTPException if password does not meet requirements."""
    errors = []
    if len(password) < 8:
        errors.append("at least 8 characters")
    if not any(c.isupper() for c in password):
        errors.append("at least one uppercase letter")
    if not any(c.isdigit() for c in password):
        errors.append("at least one digit")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Password must contain {', '.join(errors)}.",
        )
