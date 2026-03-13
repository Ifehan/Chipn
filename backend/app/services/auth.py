import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from sqlalchemy.orm import Session

from app.config import settings

_ROUNDS = 12


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=_ROUNDS)).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def create_access_token(subject: str) -> tuple[str, int]:
    """Returns (encoded_token, expires_in_seconds)."""
    expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=expire_minutes)
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": now,
        "jti": str(uuid.uuid4()),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, expire_minutes * 60


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def create_refresh_token(user_id: str, db: Session) -> tuple[str, int]:
    from app.models.refresh_token import RefreshToken

    expire_days = settings.REFRESH_TOKEN_EXPIRE_DAYS
    expires_at = datetime.now(timezone.utc) + timedelta(days=expire_days)
    token = secrets.token_urlsafe(64)

    db_token = RefreshToken(token=token, user_id=user_id, expires_at=expires_at)
    db.add(db_token)
    db.commit()

    return token, expire_days * 24 * 60 * 60


def verify_refresh_token(token: str, db: Session) -> Optional[str]:
    """Returns user_id if token is valid and not expired/revoked, else None."""
    from app.models.refresh_token import RefreshToken

    db_token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token, RefreshToken.revoked == False)  # noqa: E712
        .first()
    )

    if not db_token:
        return None

    if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return None

    return db_token.user_id


def revoke_refresh_token(token: str, db: Session) -> bool:
    """Revokes a refresh token. Returns True if found and revoked."""
    from app.models.refresh_token import RefreshToken

    db_token = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if db_token:
        db_token.revoked = True
        db.commit()
        return True
    return False
