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


blog_post_repo = BlogPostRepository(BlogPost)
