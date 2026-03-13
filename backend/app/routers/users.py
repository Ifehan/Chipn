from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.user import CreateUserRequest, UpdateUserRequest, UserResponse
from app.services.auth import hash_password

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
    if user_id != current_user.id and current_user.role not in ("admin", "support", "analyst"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    for field, value in request.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return _attach_transaction_totals(user, db)
