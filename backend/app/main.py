from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.models import User, Vendor, Transaction  # noqa: F401 — ensure models are registered
from app.routers import auth, mpesa, users, vendors

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Chipn API",
    description="Backend API for Chipn — M-Pesa bill splitting platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(vendors.router)
app.include_router(mpesa.router)


@app.get("/health")
def health():
    return {"status": "ok"}
