import json
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://loc:loc@localhost:5432/loc"
    redis_url: str = "redis://localhost:6379"
    # NoDecode is load-bearing. For complex field types pydantic-settings JSON-decodes
    # the raw env value in EnvSettingsSource *before* any validator runs, so the
    # comma-separated form used by docker-compose and .env.example raised
    # SettingsError and the API refused to boot. NoDecode hands the raw string to
    # parse_cors_origins below instead. Both forms are accepted; see the validator.
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: object) -> list[str]:
        if isinstance(v, str):
            s = v.strip()
            # A JSON array is still accepted: it was the only form that worked
            # before NoDecode, so deployed environments may already be set that way.
            if s.startswith("["):
                try:
                    return [str(o).strip() for o in json.loads(s) if str(o).strip()]
                except json.JSONDecodeError:
                    pass
            return [o.strip() for o in s.split(",") if o.strip()]
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
