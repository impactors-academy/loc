from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/loc"
    redis_url: str = "redis://localhost:6379"
    cors_origins: list[str] = ["http://localhost:3000"]

    # Email — set in .env to enable notify_partner()
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "noreply@loctravels.com"
    email_to: str = ""  # LOC team inbox for lead notifications

    model_config = {"env_file": ".env"}


settings = Settings()
