from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15       # 15 min — was 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ENVIRONMENT: str = "development"

    MPESA_CONSUMER_KEY: str
    MPESA_CONSUMER_SECRET: str
    MPESA_SHORTCODE: str
    MPESA_PASSKEY: str
    MPESA_ENVIRONMENT: str = "sandbox"
    MPESA_CALLBACK_URL: str
    MPESA_CALLBACK_SECRET: str = ""             # Must match ?secret= in callback URL

    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "Chipn <onboarding@resend.dev>"

    FRONTEND_URL: str = "http://localhost:5173"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def mpesa_base_url(self) -> str:
        if self.MPESA_ENVIRONMENT == "production":
            return "https://api.safaricom.co.ke"
        return "https://sandbox.safaricom.co.ke"


settings = Settings()
