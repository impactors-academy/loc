from sqlalchemy import func, or_
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

    def search(self, db: Session, q: str, category: str | None, skip: int = 0, limit: int = 20) -> list[Experience]:
        tsquery = func.plainto_tsquery("english", q)
        trgm_filter = self.model.title.op("%%")(q)

        base = db.query(self.model).filter(
            or_(
                func.to_tsvector("english",
                    func.coalesce(self.model.title, "") + " " +
                    func.coalesce(self.model.description, "") + " " +
                    func.coalesce(self.model.location, "") + " " +
                    func.coalesce(self.model.category, "")
                ).op("@@")(tsquery),
                trgm_filter,
            )
        )

        if category:
            base = base.filter(self.model.category == category)

        return (
            base
            .order_by(self.model.is_featured.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


experience_repo = ExperienceRepository(Experience)
