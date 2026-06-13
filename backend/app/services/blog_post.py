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

    def get_related(self, db: Session, slug: str, limit: int = 3) -> list[BlogPostRead]:
        post = blog_post_repo.get_by_slug(db, slug)
        if not post:
            raise HTTPException(status_code=404, detail="Article not found")
        tags: list[str] = [t.strip() for t in (post.tags or "").split(",") if t.strip()]
        return blog_post_repo.get_related(db, post.id, tags, limit)

    def embed_and_save(self, db: Session, post_id: str) -> None:
        from app.core.embeddings import blog_text, embed
        post = blog_post_repo.get(db, post_id)
        if not post:
            return
        text = blog_text(post.title, post.excerpt, post.content)
        embedding = embed(text)
        if embedding:
            post.embedding = embedding
            db.commit()


blog_post_service = BlogPostService()
