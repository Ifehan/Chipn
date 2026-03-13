from datetime import datetime
from typing import Optional, Union

from pydantic import BaseModel


class PaymentItem(BaseModel):
    amount: float
    phone_number: str


class StkPushRequest(BaseModel):
    payments: list[PaymentItem]
    account_reference: str
    transaction_desc: str
    vendor_id: str


class StkPushResponse(BaseModel):
    message: str
    checkout_request_id: Optional[str] = None
    merchant_request_id: Optional[str] = None
    response_code: Optional[str] = None
    response_description: Optional[str] = None
    customer_message: Optional[str] = None


class TransactionResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    merchant_request_id: Optional[str]
    checkout_request_id: Optional[str]
    phone_number: str
    amount: float
    account_reference: str
    transaction_desc: str
    mpesa_receipt_number: Optional[str]
    transaction_date: Optional[str]
    status: str
    callback_url: Optional[str]
    callback_received: Optional[str]
    result_code: Optional[str]
    result_desc: Optional[str]
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: str


class TransactionHistoryResponse(BaseModel):
    transactions: list
    total: int
    page: int
    page_size: int
    status_filter: str


class MpesaCallbackMetadataItem(BaseModel):
    Name: str
    Value: Optional[Union[str, int, float]] = None


class MpesaCallbackStkCallback(BaseModel):
    MerchantRequestID: str
    CheckoutRequestID: str
    ResultCode: int
    ResultDesc: str
    CallbackMetadata: Optional[dict] = None


class MpesaCallbackBody(BaseModel):
    stkCallback: MpesaCallbackStkCallback


class MpesaCallback(BaseModel):
    Body: MpesaCallbackBody
