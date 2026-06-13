from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ProductBase(BaseModel):
    title: str
    description: str | None = None
    type: str
    price: float
    image_url: str | None = None
    purchase_url: str

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ProductCreate(ProductBase):
    slug: str


class ProductUpdate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: str
    slug: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
