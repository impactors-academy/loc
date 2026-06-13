from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.blog_post import BlogPostRead
from app.services.blog_post import blog_post_service

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("/", response_model=list[BlogPostRead])
@cache(expire=300, namespace="blog:list")
async def list_posts(
    tag: str | None = None,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    return blog_post_service.get_all(db, tag, pages["skip"], pages["limit"])


@router.get("/{slug}/related", response_model=list[BlogPostRead])
@cache(expire=300, namespace="blog:related")
async def related_posts(slug: str, db: Session = Depends(get_db)):
    return blog_post_service.get_related(db, slug)


@router.get("/{slug}", response_model=BlogPostRead)
@cache(expire=300, namespace="blog:detail")
async def get_post(slug: str, db: Session = Depends(get_db)):
    return blog_post_service.get_by_slug(db, slug)
