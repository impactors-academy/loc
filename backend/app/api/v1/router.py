from fastapi import APIRouter

from app.api.v1.endpoints import blog, contact, experiences, fx, leads, products, properties, referrals, uploads

router = APIRouter()

router.include_router(experiences.router)
router.include_router(properties.router)
router.include_router(products.router)
router.include_router(blog.router)
router.include_router(contact.router)
router.include_router(leads.router)
router.include_router(referrals.router)
router.include_router(uploads.router)
router.include_router(fx.router)
