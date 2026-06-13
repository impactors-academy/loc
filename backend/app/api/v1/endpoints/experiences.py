from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.experience import ExperienceRead
from app.services.experience import experience_service

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.get("/", response_model=list[ExperienceRead])
@cache(expire=300, namespace="experiences:list")
async def list_experiences(
    category: str | None = None,
    q: str | None = None,
    semantic: bool = False,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    return experience_service.get_all(db, category, q, pages["skip"], pages["limit"], semantic)


@router.get("/{slug}", response_model=ExperienceRead)
@cache(expire=300, namespace="experiences:detail")
async def get_experience(slug: str, db: Session = Depends(get_db)):
    return experience_service.get_by_slug(db, slug)
