from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr

UserRole = Literal["user", "admin", "support", "analyst"]


class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    id_type: str
    id_number: str
    password: str


class UpdateUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    id_type: Optional[str] = None


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
