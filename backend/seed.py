"""
Seed script — run once to populate vendors and admin user.
Usage: python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app.models import User, Vendor, Transaction  # noqa: F401
from app.database import Base
from app.services.auth import hash_password

Base.metadata.create_all(bind=engine)

VENDORS = [
    {"name": "Nairobi Water & Sewerage", "paybill_number": "444300"},
    {"name": "Kenya Power (KPLC)", "paybill_number": "888880"},
    {"name": "Safaricom Postpaid", "paybill_number": "100"},
    {"name": "Zuku Fiber", "paybill_number": "400222"},
    {"name": "DSTV Kenya", "paybill_number": "625625"},
    {"name": "GoTV Kenya", "paybill_number": "625900"},
    {"name": "Airtel Kenya", "paybill_number": "220220"},
    {"name": "Telkom Kenya", "paybill_number": "997"},
    {"name": "Faiba 4G", "paybill_number": "967032"},
    {"name": "Stima SACCO", "paybill_number": "000300"},
]

ADMIN = {
    "first_name": "Admin",
    "last_name": "Chipn",
    "email": "admin@chipn.com",
    "phone_number": "0700000000",
    "id_type": "National ID",
    "password": "Admin@2026!",
    "role": "admin",
}

db = SessionLocal()

try:
    # Seed vendors
    added_vendors = 0
    for v in VENDORS:
        exists = db.query(Vendor).filter(Vendor.paybill_number == v["paybill_number"]).first()
        if not exists:
            db.add(Vendor(**v))
            added_vendors += 1
    db.commit()
    print(f"✅ Vendors: {added_vendors} added ({len(VENDORS) - added_vendors} already existed)")

    # Seed admin user
    existing_admin = db.query(User).filter(User.email == ADMIN["email"]).first()
    if not existing_admin:
        admin = User(
            first_name=ADMIN["first_name"],
            last_name=ADMIN["last_name"],
            email=ADMIN["email"],
            phone_number=ADMIN["phone_number"],
            id_type=ADMIN["id_type"],
            hashed_password=hash_password(ADMIN["password"]),
            role=ADMIN["role"],
        )
        db.add(admin)
        db.commit()
        print(f"✅ Admin user created: {ADMIN['email']} / {ADMIN['password']}")
    else:
        print(f"ℹ️  Admin user already exists: {ADMIN['email']}")

    print("\n🎉 Seeding complete.")

except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")
    raise
finally:
    db.close()
