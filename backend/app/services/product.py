from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.product import product_repo
from app.schemas.product import ProductRead


class ProductService:
    def get_all(self, db: Session, skip: int, limit: int) -> list[ProductRead]:
        return product_repo.get_multi(db, skip, limit)

    def get_by_slug(self, db: Session, slug: str) -> ProductRead:
        obj = product_repo.get_by_slug(db, slug)
        if not obj:
            raise HTTPException(status_code=404, detail="Product not found")
        return obj


product_service = ProductService()
