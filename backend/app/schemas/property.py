from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class PropertyBase(BaseModel):
    title: str
    description: str | None = None
    type: str
    country: str | None = None
    location: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    images: list[str] = []
    listing_tier: str = "standard"
    owner_contact: str | None = None

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


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
