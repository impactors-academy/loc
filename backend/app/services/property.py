from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.property import property_repo
from app.schemas.property import PropertyRead


class PropertyService:
    def get_all(self, db: Session, property_type: str | None, skip: int, limit: int) -> list[PropertyRead]:
        if property_type:
            return property_repo.get_by_type(db, property_type, skip, limit)
        return property_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> PropertyRead:
        obj = property_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Property not found")
        return obj


property_service = PropertyService()
