from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://postgres:199922@localhost:5432/loc"
    redis_url: str = "redis://localhost:6379"
    cors_origins: list[str] = ["http://localhost:3000"]

    # AI / embeddings — set to enable pgvector hybrid search (EXP-6)
    openai_api_key: str = ""

    # Email — set to enable notify_partner() (STAY-4)
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "noreply@loctravels.com"
    email_to: str = ""

    model_config = {"env_file": ".env"}

    @property
    def embeddings_enabled(self) -> bool:
        return bool(self.openai_api_key)

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host and self.email_to)


settings = Settings()
