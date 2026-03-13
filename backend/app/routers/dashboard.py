from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.transaction import Transaction
from app.models.user import User
from app.models.vendor import Vendor

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardTransaction(BaseModel):
    id: str
    transaction_id: str
    vendor_id: Optional[str]
    vendor_name: Optional[str]
    amount: float
    status: str
    created_at: str
    phone_number: str
    account_reference: str

    model_config = {"from_attributes": True}


class RecentTransactionsResponse(BaseModel):
    transactions: list[DashboardTransaction]
    page: int
    size: int
    total: int
    total_pages: int


@router.get("/recent-transactions", response_model=RecentTransactionsResponse)
def get_recent_transactions(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=5, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.created_at.desc())
    )

    total = query.count()
    total_pages = max(1, -(-total // size))  # ceiling division

    transactions = query.offset((page - 1) * size).limit(size).all()

    # Build vendor name map for the fetched transactions
    vendor_ids = {t.vendor_id for t in transactions if t.vendor_id}
    vendors = {}
    if vendor_ids:
        for v in db.query(Vendor).filter(Vendor.id.in_(vendor_ids)).all():
            vendors[v.id] = v.name

    items = [
        DashboardTransaction(
            id=t.id,
            transaction_id=t.checkout_request_id or t.id,
            vendor_id=t.vendor_id,
            vendor_name=vendors.get(t.vendor_id) if t.vendor_id else None,
            amount=float(t.amount),
            status=t.status,
            created_at=t.created_at.isoformat(),
            phone_number=t.phone_number,
            account_reference=t.account_reference,
        )
        for t in transactions
    ]

    return RecentTransactionsResponse(
        transactions=items,
        page=page,
        size=size,
        total=total,
        total_pages=total_pages,
    )
