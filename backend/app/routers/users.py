from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.user import CreateUserRequest, UpdateUserRequest, UserResponse
from app.services.auth import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["users"])


def _attach_transaction_totals(user: User, db: Session) -> UserResponse:
    pending_total = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.user_id == user.id, Transaction.status == "pending")
        .scalar()
        or 0.0
    )
    completed_total = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.user_id == user.id, Transaction.status == "completed")
        .scalar()
        or 0.0
    )
    data = UserResponse.model_validate(user)
    data.pending_transactions_total = float(pending_total)
    data.completed_transactions_total = float(completed_total)
    return data


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(request: CreateUserRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    user = User(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        phone_number=request.phone_number,
        id_type=request.id_type,
        id_number=request.id_number,
        hashed_password=hash_password(request.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _attach_transaction_totals(current_user, db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # M-6: Check permission and existence together — always 404 to prevent enumeration
    is_self = user_id == current_user.id
    is_privileged = current_user.role in ("admin", "support", "analyst")

    if not is_self and not is_privileged:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return _attach_transaction_totals(user, db)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    request: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    for field, value in request.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return _attach_transaction_totals(user, db)


class ChangeEmailRequest(BaseModel):
    """M-5: Email changes require current password re-authentication."""
    new_email: EmailStr
    current_password: str


@router.post("/me/change-email", response_model=UserResponse)
def change_email(
    request: ChangeEmailRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect",
        )

    existing = db.query(User).filter(User.email == request.new_email).first()
    if existing and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already in use",
        )

    current_user.email = request.new_email
    db.commit()
    db.refresh(current_user)
    return _attach_transaction_totals(current_user, db)
