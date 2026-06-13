from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


class BlogPostBase(BaseModel):
    title: str
    excerpt: str | None = None
    content: str | None = None
    image_url: str | None = None
    tags: list[str] = []

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    @field_validator("tags", mode="before")
    @classmethod
    def split_tags(cls, v: str | list) -> list[str]:
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v


class BlogPostCreate(BlogPostBase):
    slug: str


class BlogPostUpdate(BlogPostBase):
    pass


class BlogPostRead(BlogPostBase):
    id: str
    slug: str
    published_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
