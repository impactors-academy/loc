from sqlalchemy import func, text
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
    def get_by_category(
        self, db: Session, category: str, country: str | None = None, skip: int = 0, limit: int = 20
    ) -> list[Experience]:
        q = db.query(self.model).filter(self.model.category == category)
        if country:
            q = q.filter(self.model.country == country)
        return q.order_by(self.model.is_featured.desc()).offset(skip).limit(limit).all()

    def get_multi(
        self, db: Session, country: str | None = None, skip: int = 0, limit: int = 20
    ) -> list[Experience]:
        q = db.query(self.model)
        if country:
            q = q.filter(self.model.country == country)
        return q.order_by(self.model.is_featured.desc()).offset(skip).limit(limit).all()

    def search(
        self,
        db: Session,
        q: str,
        category: str | None,
        country: str | None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Experience]:
        tsquery = func.plainto_tsquery("english", q)
        fts = func.to_tsvector(
            "english",
            func.coalesce(self.model.title, "") + " " +
            func.coalesce(self.model.description, "") + " " +
            func.coalesce(self.model.location, "") + " " +
            func.coalesce(self.model.category, "") + " " +
            func.coalesce(self.model.country, ""),
        ).op("@@")(tsquery)

        base = db.query(self.model).filter(fts)
        if category:
            base = base.filter(self.model.category == category)
        if country:
            base = base.filter(self.model.country == country)
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
        country: str | None,
        limit: int = 20,
    ) -> list[Experience]:
        params: dict = {"q": q}
        if category:
            params["cat"] = category
        if country:
            params["country"] = country

        cat_clause = " AND category = :cat" if category else ""
        country_clause = " AND country = :country" if country else ""

        _fts = "to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(location,'') || ' ' || coalesce(category,'') || ' ' || coalesce(country,''))"
        _tsq = "plainto_tsquery('english', :q)"

        # ── keyword arm ────────────────────────────────────────────────────
        kw_ids: list[str] = [
            row[0]
            for row in db.execute(
                text(
                    f"SELECT id FROM experiences WHERE {_fts} @@ {_tsq}"
                    + cat_clause
                    + country_clause
                    + f" ORDER BY ts_rank({_fts}, {_tsq}) DESC LIMIT 20"
                ),
                params,
            ).fetchall()
        ]

        # ── vector arm ─────────────────────────────────────────────────────
        vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
        vec_ids: list[str] = [
            row[0]
            for row in db.execute(
                text(
                    "SELECT id FROM experiences WHERE embedding IS NOT NULL"
                    + cat_clause
                    + country_clause
                    + " ORDER BY embedding <=> :vec LIMIT 20"
                ),
                {**params, "vec": vec_str},
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
