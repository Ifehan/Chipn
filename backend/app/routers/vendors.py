from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.vendor import CreateVendorRequest, VendorResponse

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
def get_vendors(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Vendor).order_by(Vendor.name).all()


@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
def create_vendor(
    request: CreateVendorRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")

    existing = db.query(Vendor).filter(Vendor.paybill_number == request.paybill_number).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Paybill number already exists")

    vendor = Vendor(name=request.name, paybill_number=request.paybill_number)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor
