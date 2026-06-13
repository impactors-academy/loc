from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.experience import experience_repo
from app.schemas.experience import ExperienceRead


class ExperienceService:
    def get_all(
        self,
        db: Session,
        category: str | None,
        q: str | None,
        skip: int,
        limit: int,
    ) -> list[ExperienceRead]:
        if q:
            return experience_repo.search(db, q, category, skip, limit)
        if category:
            return experience_repo.get_by_category(db, category, skip, limit)
        return experience_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> ExperienceRead:
        obj = experience_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Experience not found")
        return obj


experience_service = ExperienceService()
