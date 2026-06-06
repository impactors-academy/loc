from datetime import datetime

from pydantic import BaseModel, field_validator


class BlogPostBase(BaseModel):
    title: str
    excerpt: str | None = None
    content: str | None = None
    image_url: str | None = None
    tags: list[str] = []


class BlogPostCreate(BlogPostBase):
    slug: str


class BlogPostUpdate(BlogPostBase):
    pass


class BlogPostRead(BlogPostBase):
    id: str
    slug: str
    published_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("tags", mode="before")
    @classmethod
    def split_tags(cls, v: str | list) -> list[str]:
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v
