from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.config import settings
from app.database import Base, engine
from app.models import User, Vendor, Transaction, PasswordResetToken, RefreshToken  # noqa: F401
from app.routers import auth, dashboard, mpesa, users, vendors

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# C-3: Rate limiter (key = client IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(
    title="Chipn API",
    description="Backend API for Chipn",
    version="1.0.0",
    # H-7: Disable interactive docs in production
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# H-6: Security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "0"          # CSP is better than X-XSS-Protection
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none'"
        )
        return response


app.add_middleware(SecurityHeadersMiddleware)

# M-1: Narrow CORS — specific methods and headers only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(vendors.router)
app.include_router(mpesa.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def seed_vendors():
    from app.database import SessionLocal
    from app.models.vendor import Vendor as VendorModel
    db = SessionLocal()
    try:
        if db.query(VendorModel).count() == 0:
            for name, paybill in [
                ("Safaricom", "174379"),
                ("Kenya Power", "888880"),
                ("Nairobi Water", "444444"),
                ("DSTV Kenya", "333333"),
                ("Uber Kenya", "222222"),
            ]:
                db.add(VendorModel(name=name, paybill_number=paybill))
            db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
