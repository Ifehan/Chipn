import base64
from datetime import datetime, timezone

import httpx

from app.config import settings


def _get_timestamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")


def _get_password(shortcode: str, passkey: str, timestamp: str) -> str:
    raw = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(raw.encode()).decode()


async def get_access_token() -> str:
    credentials = base64.b64encode(
        f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}".encode()
    ).decode()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.mpesa_base_url}/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {credentials}"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["access_token"]


async def initiate_stk_push(
    phone_number: str,
    amount: int,
    account_reference: str,
    transaction_desc: str,
) -> dict:
    token = await get_access_token()
    timestamp = _get_timestamp()
    password = _get_password(settings.MPESA_SHORTCODE, settings.MPESA_PASSKEY, timestamp)

    # Normalize phone number to 254XXXXXXXXX format
    phone = phone_number.strip().replace("+", "").replace(" ", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": account_reference[:12],
        "TransactionDesc": transaction_desc[:13],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.mpesa_base_url}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()
