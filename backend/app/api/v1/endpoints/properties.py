from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.property import PropertyRead
from app.services.property import property_service

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/", response_model=list[PropertyRead])
@cache(expire=300, namespace="properties:list")
async def list_properties(
    type: str | None = None,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    return property_service.get_all(db, type, pages["skip"], pages["limit"])


@router.get("/{slug}", response_model=PropertyRead)
@cache(expire=300, namespace="properties:detail")
async def get_property(slug: str, db: Session = Depends(get_db)):
    return property_service.get_by_slug(db, slug)
