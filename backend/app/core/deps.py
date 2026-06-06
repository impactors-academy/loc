from collections.abc import Generator

from fastapi import Query
from sqlalchemy.orm import Session

from app.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def pagination(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    return {"skip": skip, "limit": limit}
