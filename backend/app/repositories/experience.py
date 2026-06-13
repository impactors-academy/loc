from sqlalchemy import func, or_, text
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.repositories.base import BaseRepository


def _rrf(ranked_lists: list[list[str]], k: int = 60) -> list[str]:
    scores: dict[str, float] = {}
    for ranked in ranked_lists:
        for pos, id_ in enumerate(ranked):
            scores[id_] = scores.get(id_, 0.0) + 1.0 / (k + pos + 1)
    return sorted(scores, key=lambda i: scores[i], reverse=True)


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
                func.to_tsvector(
                    "english",
                    func.coalesce(self.model.title, "") + " " +
                    func.coalesce(self.model.description, "") + " " +
                    func.coalesce(self.model.location, "") + " " +
                    func.coalesce(self.model.category, ""),
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

    def hybrid_search(
        self,
        db: Session,
        q: str,
        embedding: list[float],
        category: str | None,
        limit: int = 20,
    ) -> list[Experience]:
        # ── keyword arm ────────────────────────────────────────────────────
        tsquery = func.plainto_tsquery("english", q)
        kw_ids: list[str] = [
            row[0]
            for row in db.execute(
                text(
                    "SELECT id FROM experiences "
                    "WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(location,'') || ' ' || coalesce(category,'')) @@ plainto_tsquery('english', :q)"
                    + (" AND category = :cat" if category else "")
                    + " ORDER BY ts_rank(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(location,'') || ' ' || coalesce(category,'')), plainto_tsquery('english', :q)) DESC LIMIT 20"
                ),
                {"q": q, **({} if not category else {"cat": category})},
            ).fetchall()
        ]

        # ── vector arm ─────────────────────────────────────────────────────
        vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
        vec_ids: list[str] = [
            row[0]
            for row in db.execute(
                text(
                    "SELECT id FROM experiences WHERE embedding IS NOT NULL"
                    + (" AND category = :cat" if category else "")
                    + " ORDER BY embedding <=> :vec LIMIT 20"
                ),
                {"vec": vec_str, **({} if not category else {"cat": category})},
            ).fetchall()
        ]

        # ── RRF fusion ─────────────────────────────────────────────────────
        fused_ids = _rrf([kw_ids, vec_ids])[:limit]
        if not fused_ids:
            return []

        id_to_pos = {id_: pos for pos, id_ in enumerate(fused_ids)}
        rows = db.query(self.model).filter(self.model.id.in_(fused_ids)).all()
        return sorted(rows, key=lambda r: id_to_pos.get(r.id, 999))


experience_repo = ExperienceRepository(Experience)
