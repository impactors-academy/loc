from pydantic import BaseModel


class ProductBase(BaseModel):
    title: str
    description: str | None = None
    type: str
    price: float
    image_url: str | None = None
    purchase_url: str


class ProductCreate(ProductBase):
    slug: str


class ProductUpdate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: str
    slug: str

    model_config = {"from_attributes": True}
