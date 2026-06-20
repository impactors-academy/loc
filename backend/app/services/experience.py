from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.experience import experience_repo
from app.schemas.experience import ExperienceRead


class ExperienceService:
    def get_all(
        self,
        db: Session,
        category: str | None,
        country: str | None,
        q: str | None,
        skip: int,
        limit: int,
        semantic: bool = False,
    ) -> list[ExperienceRead]:
        if q and semantic:
            from app.core.embeddings import embed, experience_text
            embedding = embed(experience_text(q, None, None, category or ""))
            if embedding:
                return experience_repo.hybrid_search(db, q, embedding, category, country, limit)
        if q:
            return experience_repo.search(db, q, category, country, skip, limit)
        if category:
            return experience_repo.get_by_category(db, category, country, skip, limit)
        return experience_repo.get_multi(db, country, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> ExperienceRead:
        obj = experience_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Experience not found")
        return obj


experience_service = ExperienceService()
