from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.blog_post import BlogPost
from app.repositories.base import BaseRepository


class BlogPostRepository(BaseRepository[BlogPost]):
    def get_by_tag(self, db: Session, tag: str, skip: int = 0, limit: int = 20) -> list[BlogPost]:
        return (
            db.query(self.model)
            .filter(self.model.tags.contains(tag))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_related(self, db: Session, post_id: str, tags: list[str], limit: int = 3) -> list[BlogPost]:
        # Vector cosine similarity when embedding exists
        source = db.query(self.model).filter(self.model.id == post_id).first()
        if source and source.embedding is not None:
            vec_str = "[" + ",".join(str(x) for x in source.embedding) + "]"
            rows = db.execute(
                text(
                    "SELECT id FROM blog_posts WHERE id != :id AND embedding IS NOT NULL "
                    "ORDER BY embedding <=> :vec LIMIT :lim"
                ),
                {"id": post_id, "vec": vec_str, "lim": limit},
            ).fetchall()
            ids = [r[0] for r in rows]
            if ids:
                id_to_pos = {id_: pos for pos, id_ in enumerate(ids)}
                results = db.query(self.model).filter(self.model.id.in_(ids)).all()
                return sorted(results, key=lambda r: id_to_pos.get(r.id, 999))

        # Fallback: tag overlap
        if not tags:
            return db.query(self.model).filter(self.model.id != post_id).limit(limit).all()

        from sqlalchemy import or_
        return (
            db.query(self.model)
            .filter(
                self.model.id != post_id,
                or_(*[self.model.tags.contains(t) for t in tags]),
            )
            .limit(limit)
            .all()
        )


blog_post_repo = BlogPostRepository(BlogPost)
