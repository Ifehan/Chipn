"""
Seed data for fresh database environments.

Runs on every startup — each function checks if data already exists
before inserting, so it's safe to run repeatedly (idempotent).

To add new seed data:
1. Write a function that checks for existing rows before inserting
2. Call it from run_all_seeds()
3. That's it — it will run on next deploy automatically
"""
import logging
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.vendor import Vendor

logger = logging.getLogger(__name__)

VENDORS = [
    ("Safaricom", "174379"),
    ("Kenya Power", "888880"),
    ("Nairobi Water", "444444"),
    ("DSTV Kenya", "333333"),
    ("Uber Kenya", "222222"),
]


def seed_vendors(db: Session) -> None:
    if db.query(Vendor).count() > 0:
        return
    for name, paybill in VENDORS:
        db.add(Vendor(name=name, paybill_number=paybill))
    db.commit()
    logger.info("Seeded %d vendors", len(VENDORS))


def run_all_seeds() -> None:
    db = SessionLocal()
    try:
        seed_vendors(db)
    finally:
        db.close()
