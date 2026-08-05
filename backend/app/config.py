from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://loc:loc@localhost:5432/loc"
    redis_url: str = "redis://localhost:6379"
    cors_origins: list[str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: object) -> list[str]:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v  # type: ignore[return-value]

    # Editor auth — required for all write endpoints (POST/PUT/DELETE)
    editor_api_key: str = ""

    # AI / embeddings — set to enable pgvector hybrid search (EXP-6)
    openai_api_key: str = ""

    # Email — set to enable notify_partner() (STAY-4)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "noreply@loctravels.com"
    email_to: str = ""

    # extra="ignore": the repo root .env is shared with docker-compose, which defines
    # vars this app does not consume (PGADMIN_*, POSTGRES_*). Without this, any such
    # var raises "Extra inputs are not permitted" and the API refuses to boot.
    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def embeddings_enabled(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host and self.email_to)


settings = Settings()
