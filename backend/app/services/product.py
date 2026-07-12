from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories.product import product_repo
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate


class ProductService:
    def get_all(self, db: Session, skip: int, limit: int) -> list[ProductRead]:
        return product_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> ProductRead:
        obj = product_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        return obj

    def create(self, db: Session, data: ProductCreate) -> ProductRead:
        if product_repo.get_by_slug(db, data.slug):
            raise HTTPException(status_code=409, detail="A product with that slug already exists")
        product = Product(**data.model_dump())
        return product_repo.create(db, product)

    def update(self, db: Session, slug: str, data: ProductUpdate) -> ProductRead:
        obj = product_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        for field, value in data.model_dump().items():
            setattr(obj, field, value)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, slug: str) -> None:
        obj = product_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        product_repo.delete(db, obj.id)


product_service = ProductService()
