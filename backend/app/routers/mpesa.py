from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.payment import (
    MpesaCallback,
    StkPushRequest,
    StkPushResponse,
    TransactionHistoryResponse,
    TransactionResponse,
)
from app.services.mpesa import initiate_stk_push

router = APIRouter(prefix="/mpesa", tags=["mpesa"])


@router.post("/stk-push", response_model=StkPushResponse)
async def stk_push(
    request: StkPushRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not request.payments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one payment is required",
        )

    results = []
    for payment in request.payments:
        try:
            mpesa_response = await initiate_stk_push(
                phone_number=payment.phone_number,
                amount=int(payment.amount),
                account_reference=request.account_reference,
                transaction_desc=request.transaction_desc,
            )

            transaction = Transaction(
                merchant_request_id=mpesa_response.get("MerchantRequestID"),
                checkout_request_id=mpesa_response.get("CheckoutRequestID"),
                phone_number=payment.phone_number,
                amount=payment.amount,
                account_reference=request.account_reference,
                transaction_desc=request.transaction_desc,
                status="pending",
                callback_url=mpesa_response.get("CallBackURL"),
                user_id=current_user.id,
                vendor_id=request.vendor_id,
            )
            db.add(transaction)
            results.append(mpesa_response)

        except Exception as e:
            transaction = Transaction(
                phone_number=payment.phone_number,
                amount=payment.amount,
                account_reference=request.account_reference,
                transaction_desc=request.transaction_desc,
                status="failed",
                error_message=str(e),
                user_id=current_user.id,
                vendor_id=request.vendor_id,
            )
            db.add(transaction)

    db.commit()

    if not results:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="All STK push requests failed",
        )

    first = results[0]
    return StkPushResponse(
        message=first.get("CustomerMessage", "STK push initiated successfully"),
        checkout_request_id=first.get("CheckoutRequestID"),
        merchant_request_id=first.get("MerchantRequestID"),
        response_code=first.get("ResponseCode"),
        response_description=first.get("ResponseDescription"),
        customer_message=first.get("CustomerMessage"),
    )


@router.get("/transactions", response_model=TransactionHistoryResponse)
def get_transactions(
    status: str = Query(default="all", description="Filter by status: pending, completed, failed, all"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if status != "all":
        query = query.filter(Transaction.status == status)

    total = query.count()
    transactions = (
        query.order_by(Transaction.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return TransactionHistoryResponse(
        transactions=[TransactionResponse.model_validate(t) for t in transactions],
        total=total,
        page=page,
        page_size=page_size,
        status_filter=status,
    )


@router.post("/callback", status_code=status.HTTP_200_OK)
def mpesa_callback(payload: MpesaCallback, db: Session = Depends(get_db)):
    callback = payload.Body.stkCallback
    transaction = (
        db.query(Transaction)
        .filter(Transaction.checkout_request_id == callback.CheckoutRequestID)
        .first()
    )

    if not transaction:
        return {"ResultCode": 0, "ResultDesc": "Accepted"}

    transaction.result_code = str(callback.ResultCode)
    transaction.result_desc = callback.ResultDesc
    transaction.callback_received = "received"

    if callback.ResultCode == 0 and callback.CallbackMetadata:
        items = callback.CallbackMetadata.get("Item", [])
        metadata = {item["Name"]: item.get("Value") for item in items}
        transaction.mpesa_receipt_number = metadata.get("MpesaReceiptNumber")
        transaction.transaction_date = str(metadata.get("TransactionDate", ""))
        transaction.status = "completed"
    else:
        transaction.status = "failed"
        transaction.error_message = callback.ResultDesc

    db.commit()
    return {"ResultCode": 0, "ResultDesc": "Accepted"}
