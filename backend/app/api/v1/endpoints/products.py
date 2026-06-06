from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.schemas.product import ProductRead
from app.services.product import product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductRead])
@cache(expire=300, namespace="products:list")
async def list_products(db: Session = Depends(get_db), pages: dict = Depends(pagination)):
    return product_service.get_all(db, pages["skip"], pages["limit"])


@router.get("/{slug}", response_model=ProductRead)
@cache(expire=300, namespace="products:detail")
async def get_product(slug: str, db: Session = Depends(get_db)):
    return product_service.get_by_slug(db, slug)
