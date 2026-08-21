from fastapi import APIRouter

from app.api.v1.endpoints import admin_metrics, blog, contact, experiences, leads, products, properties, referrals

router = APIRouter()

router.include_router(experiences.router)
router.include_router(properties.router)
router.include_router(products.router)
router.include_router(blog.router)
router.include_router(contact.router)
router.include_router(leads.router)
router.include_router(referrals.router)
router.include_router(admin_metrics.router)
