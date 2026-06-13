from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ExperienceBase(BaseModel):
    title: str
    description: str | None = None
    category: str
    location: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    images: list[str] = []
    is_featured: bool = False
    provider_name: str | None = None
    provider_contact: str | None = None
    referral_url: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ExperienceCreate(ExperienceBase):
    slug: str


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceRead(ExperienceBase):
    id: str
    slug: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
