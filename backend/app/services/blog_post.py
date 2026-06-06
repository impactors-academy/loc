from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.blog_post import blog_post_repo
from app.schemas.blog_post import BlogPostRead


class BlogPostService:
    def get_all(self, db: Session, tag: str | None, skip: int, limit: int) -> list[BlogPostRead]:
        if tag:
            return blog_post_repo.get_by_tag(db, tag, skip, limit)
        return blog_post_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> BlogPostRead:
        obj = blog_post_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Article not found")
        return obj


blog_post_service = BlogPostService()
