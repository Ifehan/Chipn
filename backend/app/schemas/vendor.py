from datetime import datetime

from pydantic import BaseModel


class VendorResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    paybill_number: str
    created_at: datetime
    updated_at: datetime
