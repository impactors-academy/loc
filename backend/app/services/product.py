from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.product import product_repo
from app.schemas.product import ProductCreate, ProductRead


class ProductService:
    def get_all(self, db: Session, skip: int, limit: int) -> list[ProductRead]:
        return product_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> ProductRead:
        obj = product_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        return obj

    def create(self, db: Session, data: ProductCreate) -> ProductRead:
        existing = product_repo.get_by_slug(db, data.slug)
        if existing:
            raise HTTPException(status_code=409, detail="A product with that slug already exists")
        product = Product(**data.model_dump())
        return product_repo.create(db, product)


product_service = ProductService()
