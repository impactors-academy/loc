from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate
from app.services.experience import experience_service

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.get("/", response_model=list[ExperienceRead])
@cache(expire=300, namespace="experiences:list")
async def list_experiences(
    category: str | None = None,
    country: str | None = None,
    q: str | None = None,
    semantic: bool = False,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    return experience_service.get_all(db, category, country, q, pages["skip"], pages["limit"], semantic)


@router.post("/", response_model=ExperienceRead, status_code=201)
async def create_experience(data: ExperienceCreate, db: Session = Depends(get_db)):
    return experience_service.create(db, data)


@router.get("/{slug}", response_model=ExperienceRead)
@cache(expire=300, namespace="experiences:detail")
async def get_experience(slug: str, db: Session = Depends(get_db)):
    return experience_service.get_by_slug(db, slug)


@router.put("/{slug}", response_model=ExperienceRead)
async def update_experience(slug: str, data: ExperienceUpdate, db: Session = Depends(get_db)):
    return experience_service.update(db, slug, data)


@router.delete("/{slug}", status_code=204)
async def delete_experience(slug: str, db: Session = Depends(get_db)):
    experience_service.delete(db, slug)
