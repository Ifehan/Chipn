import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_request_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    checkout_request_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(20))
    amount: Mapped[float] = mapped_column(Numeric(12, 2))
    account_reference: Mapped[str] = mapped_column(String(255))
    transaction_desc: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    mpesa_receipt_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    transaction_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    callback_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    callback_received: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    result_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    result_desc: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    vendor_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vendors.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship(back_populates="transactions")
