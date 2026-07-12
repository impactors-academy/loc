from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.property import PropertyCreate, PropertyRead, PropertyUpdate
from app.services.property import property_service

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/", response_model=list[PropertyRead])
@cache(expire=300, namespace="properties:list")
async def list_properties(
    type: str | None = None,
    country: str | None = None,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    return property_service.get_all(db, type, country, pages["skip"], pages["limit"])


@router.post("/", response_model=PropertyRead, status_code=201)
async def create_property(data: PropertyCreate, db: Session = Depends(get_db)):
    return property_service.create(db, data)


@router.get("/{slug}", response_model=PropertyRead)
@cache(expire=300, namespace="properties:detail")
async def get_property(slug: str, db: Session = Depends(get_db)):
    return property_service.get_by_slug(db, slug)


@router.put("/{slug}", response_model=PropertyRead)
async def update_property(slug: str, data: PropertyUpdate, db: Session = Depends(get_db)):
    return property_service.update(db, slug, data)


@router.delete("/{slug}", status_code=204)
async def delete_property(slug: str, db: Session = Depends(get_db)):
    property_service.delete(db, slug)
