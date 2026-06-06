from pydantic import BaseModel


class PropertyBase(BaseModel):
    title: str
    description: str | None = None
    type: str
    price_range: str | None = None
    location: str | None = None
    image_url: str | None = None
    contact_url: str | None = None


class PropertyCreate(PropertyBase):
    slug: str


class PropertyUpdate(PropertyBase):
    pass


class PropertyRead(PropertyBase):
    id: str
    slug: str

    model_config = {"from_attributes": True}
