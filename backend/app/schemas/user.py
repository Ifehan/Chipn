import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, field_validator

UserRole = Literal["user", "admin", "support", "analyst"]

_PHONE_RE = re.compile(r"^2547\d{8}$")


def _validate_phone(v: str) -> str:
    """Normalize and validate Kenyan phone numbers to 2547XXXXXXXX format."""
    digits = re.sub(r"\D", "", v)
    if digits.startswith("0") and len(digits) == 10:
        digits = "254" + digits[1:]
    elif digits.startswith("7") and len(digits) == 9:
        digits = "254" + digits
    if not _PHONE_RE.match(digits):
        raise ValueError("Phone must be a valid Kenyan number (07XXXXXXXX or 2547XXXXXXXX)")
    return digits


def _validate_password(v: str) -> str:
    errors = []
    if len(v) < 8:
        errors.append("at least 8 characters")
    if not any(c.isupper() for c in v):
        errors.append("at least one uppercase letter")
    if not any(c.isdigit() for c in v):
        errors.append("at least one digit")
    if errors:
        raise ValueError(f"Password must contain {', '.join(errors)}")
    return v


class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    id_type: str
    id_number: str
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        return _validate_password(v)

    @field_validator("phone_number")
    @classmethod
    def phone_format(cls, v: str) -> str:
        return _validate_phone(v)


class UpdateUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    id_type: Optional[str] = None
    # Email NOT included here — email changes require a dedicated, re-authenticated endpoint

    @field_validator("phone_number")
    @classmethod
    def phone_format(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return _validate_phone(v)


class UserResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    first_name: str
    last_name: str
    email: str
    phone_number: str
    id_type: str
    role: UserRole
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    pending_transactions_total: Optional[float] = None
    completed_transactions_total: Optional[float] = None
