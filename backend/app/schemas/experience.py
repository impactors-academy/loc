from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


class ExperienceBase(BaseModel):
    title: str
    description: str | None = None
    category: str
    country: str | None = None
    location: str | None = None
    duration: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    currency: str = "EUR"
    images: list[str] = []
    is_featured: bool = False
    provider_name: str | None = None
    provider_contact: str | None = None
    referral_url: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    @field_validator("images")
    @classmethod
    def dedupe_images(cls, v: list[str]) -> list[str]:
        # Same fix as PropertyBase.dedupe_images — the shared ImageUploader
        # can append duplicates on a re-selected upload.
        seen: set[str] = set()
        deduped = []
        for url in v:
            if url not in seen:
                seen.add(url)
                deduped.append(url)
        return deduped


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
