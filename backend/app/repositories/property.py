from sqlalchemy.orm import Session

from app.models.property import Property
from app.repositories.base import BaseRepository


class PropertyRepository(BaseRepository[Property]):
    def get_by_type(self, db: Session, property_type: str, skip: int = 0, limit: int = 20) -> list[Property]:
        return (
            db.query(self.model)
            .filter(self.model.type == property_type)
            .offset(skip)
            .limit(limit)
            .all()
        )


property_repo = PropertyRepository(Property)
