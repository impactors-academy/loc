from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.repositories.experience import experience_repo

router = APIRouter(prefix="/referrals", tags=["referrals"])


@router.post("/click/{slug}")
async def log_referral_click(slug: str, db: Session = Depends(get_db)):
    """EXP-5: log a referral link click for commission attribution."""
    experience = experience_repo.get_by_slug(db, slug)
    if not experience:
        return {"logged": False}
    # TODO: persist to a referral_clicks table in EXP-5 full implementation
    # For now, the referral_url itself carries UTM params for attribution
    return {"logged": True, "referral_url": experience.referral_url}
