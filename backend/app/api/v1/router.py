from fastapi import APIRouter

from app.api.v1.endpoints import blog, contact, experiences, products, properties

router = APIRouter()

router.include_router(experiences.router)
router.include_router(properties.router)
router.include_router(products.router)
router.include_router(blog.router)
router.include_router(contact.router)
