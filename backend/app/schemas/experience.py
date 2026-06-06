from pydantic import BaseModel


class ExperienceBase(BaseModel):
    title: str
    description: str | None = None
    category: str
    price_range: str | None = None
    location: str | None = None
    image_url: str | None = None
    provider_name: str | None = None
    referral_url: str | None = None


class ExperienceCreate(ExperienceBase):
    slug: str


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceRead(ExperienceBase):
    id: str
    slug: str

    model_config = {"from_attributes": True}
