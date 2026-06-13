from sqlalchemy import case
from sqlalchemy.orm import Session

from app.models.property import Property
from app.repositories.base import BaseRepository

_TIER_ORDER = case(
    (Property.listing_tier == "premium", 0),
    (Property.listing_tier == "featured", 1),
    else_=2,
)


class PropertyRepository(BaseRepository[Property]):
    def get_by_type(self, db: Session, property_type: str, skip: int = 0, limit: int = 20) -> list[Property]:
        return (
            db.query(self.model)
            .filter(self.model.type == property_type)
            .order_by(_TIER_ORDER)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi(self, db: Session, skip: int = 0, limit: int = 20) -> list[Property]:
        return (
            db.query(self.model)
            .order_by(_TIER_ORDER)
            .offset(skip)
            .limit(limit)
            .all()
        )


property_repo = PropertyRepository(Property)
