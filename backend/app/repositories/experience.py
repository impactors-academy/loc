from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.repositories.base import BaseRepository


class ExperienceRepository(BaseRepository[Experience]):
    def get_by_category(self, db: Session, category: str, skip: int = 0, limit: int = 20) -> list[Experience]:
        return (
            db.query(self.model)
            .filter(self.model.category == category)
            .order_by(self.model.is_featured.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi(self, db: Session, skip: int = 0, limit: int = 20) -> list[Experience]:
        return (
            db.query(self.model)
            .order_by(self.model.is_featured.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


experience_repo = ExperienceRepository(Experience)
