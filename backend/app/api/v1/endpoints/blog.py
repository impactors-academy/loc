from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination, require_editor_key
from app.schemas.blog_post import BlogPostCreate, BlogPostRead, BlogPostUpdate
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


@router.post("/", response_model=BlogPostRead, status_code=201, dependencies=[Depends(require_editor_key)])
async def create_post(data: BlogPostCreate, db: Session = Depends(get_db)):
    return blog_post_service.create(db, data)


@router.get("/{slug}/related", response_model=list[BlogPostRead])
@cache(expire=300, namespace="blog:related")
async def related_posts(slug: str, db: Session = Depends(get_db)):
    return blog_post_service.get_related(db, slug)


@router.get("/{slug}", response_model=BlogPostRead)
@cache(expire=300, namespace="blog:detail")
async def get_post(slug: str, db: Session = Depends(get_db)):
    return blog_post_service.get_by_slug(db, slug)


@router.put("/{slug}", response_model=BlogPostRead, dependencies=[Depends(require_editor_key)])
async def update_post(slug: str, data: BlogPostUpdate, db: Session = Depends(get_db)):
    return blog_post_service.update(db, slug, data)


@router.delete("/{slug}", status_code=204, dependencies=[Depends(require_editor_key)])
async def delete_post(slug: str, db: Session = Depends(get_db)):
    blog_post_service.delete(db, slug)
