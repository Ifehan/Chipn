import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, PasswordResetRequest, PasswordResetResponse
from app.services.auth import create_access_token, hash_password, verify_password
from app.services.email import send_password_reset_email
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token, expires_in = create_access_token(subject=user.id)
    return LoginResponse(access_token=token, expires_in=expires_in)


@router.post("/password-reset/request", response_model=PasswordResetResponse)
def request_password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if user:
        # Invalidate any existing unused tokens for this user
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
        message="Password reset link has been sent to your email."
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

    if len(request.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters")

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.hashed_password = hash_password(request.new_password)
    reset_token.used = True
    db.commit()

    return PasswordResetResponse(message="Password reset successfully. You can now log in.")
