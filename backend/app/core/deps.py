from collections.abc import Generator

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from app.config import settings
from app.db.session import SessionLocal

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def pagination(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    return {"skip": skip, "limit": limit}


def require_editor_key(api_key: str | None = Depends(_api_key_header)) -> str:
    """Gate editor endpoints behind a shared API key.

    The key is set via EDITOR_API_KEY env var. If unset, *all* write
    requests are rejected (fail-closed).
    """
    if not settings.editor_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Editor API key not configured on server",
        )
    if not api_key or api_key != settings.editor_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API key",
        )
    return api_key
