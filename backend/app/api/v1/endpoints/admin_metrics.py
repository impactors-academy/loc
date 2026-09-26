from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_editor_key
from app.models.blog_post import BlogPost
from app.models.experience import Experience
from app.models.inquiry import Inquiry
from app.models.property import Property
from app.models.referral_click import ReferralClick

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_editor_key)])


@router.get("/metrics")
async def get_metrics(db: Session = Depends(get_db)):
    """Aggregate counts for the mother dashboard's business-metrics cards
    (Phase 6B). Gated behind the same editor key as every other admin-tier
    route — inquiry counts are business data, not public, same trust level
    as /leads.
    """
    since = datetime.now(timezone.utc) - timedelta(days=7)

    inquiries_total = db.query(func.count(Inquiry.id)).scalar() or 0
    inquiries_7d = db.query(func.count(Inquiry.id)).filter(Inquiry.created_at >= since).scalar() or 0

    top_destinations = (
        db.query(Experience.country, func.count(Experience.id))
        .filter(Experience.country.isnot(None))
        .group_by(Experience.country)
        .order_by(func.count(Experience.id).desc())
        .limit(5)
        .all()
    )

    last_post_at = db.query(func.max(BlogPost.published_at)).scalar()

    clicks_total = db.query(func.count(ReferralClick.id)).scalar() or 0
    clicks_7d = (
        db.query(func.count(ReferralClick.id)).filter(ReferralClick.clicked_at >= since).scalar()
        or 0
    )
    top_referrals = (
        db.query(ReferralClick.experience_slug, Experience.title, func.count(ReferralClick.id))
        .outerjoin(Experience, Experience.slug == ReferralClick.experience_slug)
        .group_by(ReferralClick.experience_slug, Experience.title)
        .order_by(func.count(ReferralClick.id).desc())
        .limit(5)
        .all()
    )

    return {
        "inquiries": {"total": inquiries_total, "last_7d": inquiries_7d},
        "experiences": {"total": db.query(func.count(Experience.id)).scalar() or 0},
        "properties": {"total": db.query(func.count(Property.id)).scalar() or 0},
        "top_destinations": [{"country": country, "count": n} for country, n in top_destinations],
        "blog_posts": {
            "total": db.query(func.count(BlogPost.id)).scalar() or 0,
            "last_published_at": last_post_at.isoformat() if last_post_at else None,
        },
        "referral_clicks": {
            "total": clicks_total,
            "last_7d": clicks_7d,
            "top": [
                {"slug": slug, "title": title, "count": n} for slug, title, n in top_referrals
            ],
        },
    }
