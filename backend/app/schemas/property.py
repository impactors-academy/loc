from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel


class PropertyBase(BaseModel):
    title: str
    description: str | None = None
    type: str
    country: str | None = None
    location: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    currency: str = "EUR"
    images: list[str] = []
    listing_tier: str = "standard"
    owner_contact: str | None = None
    amenities: list[str] = []
    video_url: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    @field_validator("images")
    @classmethod
    def dedupe_images(cls, v: list[str]) -> list[str]:
        # A host re-selecting the same files in the uploader (or the admin
        # UI appending twice on a slow save) produced listings whose photo
        # count included repeats — reported as "photos repeat as you scroll".
        # Order-preserving dedupe on every create/update closes that off
        # regardless of which client sent the duplicate.
        seen: set[str] = set()
        deduped = []
        for url in v:
            if url not in seen:
                seen.add(url)
                deduped.append(url)
        return deduped


class PropertyCreate(PropertyBase):
    slug: str


class PropertyUpdate(PropertyBase):
    pass


class PropertyRead(PropertyBase):
    id: str
    slug: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
