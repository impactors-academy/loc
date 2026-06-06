from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.repositories.base import BaseRepository


class ExperienceRepository(BaseRepository[Experience]):
    def get_by_category(self, db: Session, category: str, skip: int = 0, limit: int = 20) -> list[Experience]:
        return (
            db.query(self.model)
            .filter(self.model.category == category)
            .offset(skip)
            .limit(limit)
            .all()
        )


experience_repo = ExperienceRepository(Experience)
