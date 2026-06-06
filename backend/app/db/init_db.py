from app.db.session import engine
from app.models.base import Base
import app.models  # noqa: F401 — ensures all models are registered before create_all


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
