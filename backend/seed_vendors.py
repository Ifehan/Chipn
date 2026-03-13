"""One-time seed script — run inside Railway container to populate vendors."""
import sys
sys.path.insert(0, ".")

from app.database import SessionLocal
from app.models.vendor import Vendor
from app.models.user import User

db = SessionLocal()

# Seed vendors
vendors = [
    ("Safaricom", "174379"),
    ("Kenya Power", "888880"),
    ("Nairobi Water", "444444"),
    ("DSTV Kenya", "333333"),
    ("Uber Kenya", "222222"),
]
for name, paybill in vendors:
    existing = db.query(Vendor).filter(Vendor.paybill_number == paybill).first()
    if not existing:
        db.add(Vendor(name=name, paybill_number=paybill))
        print(f"Added vendor: {name}")
    else:
        print(f"Skipped vendor: {name} (exists)")

# Promote first user to admin (if any exist)
first_user = db.query(User).first()
if first_user:
    first_user.role = "admin"
    print(f"Promoted {first_user.email} to admin")

db.commit()
db.close()
print("Done")
