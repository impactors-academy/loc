from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.property import Property
from app.repositories.property import property_repo
from app.schemas.property import PropertyCreate, PropertyRead, PropertyUpdate


class PropertyService:
    def get_all(self, db: Session, property_type: str | None, country: str | None, skip: int, limit: int) -> list[PropertyRead]:
        if property_type:
            return property_repo.get_by_type(db, property_type, country, skip, limit)
        return property_repo.get_multi(db, country, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> PropertyRead:
        obj = property_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Property not found")
        return obj

    def create(self, db: Session, data: PropertyCreate) -> PropertyRead:
        if property_repo.get_by_slug(db, data.slug):
            raise HTTPException(status_code=409, detail="Slug already in use")
        prop = Property(**data.model_dump())
        return property_repo.create(db, prop)

    def update(self, db: Session, slug: str, data: PropertyUpdate) -> PropertyRead:
        obj = property_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Property not found")
        for field, value in data.model_dump().items():
            setattr(obj, field, value)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, slug: str) -> None:
        obj = property_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Property not found")
        property_repo.delete(db, obj.id)


property_service = PropertyService()
