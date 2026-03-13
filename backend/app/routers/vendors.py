from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.vendor import VendorResponse

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
def get_vendors(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Vendor).order_by(Vendor.name).all()
