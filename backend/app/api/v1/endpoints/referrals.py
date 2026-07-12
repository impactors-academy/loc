from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.repositories.experience import experience_repo
from app.repositories.referral_click import referral_click_repo

router = APIRouter(prefix="/referrals", tags=["referrals"])


@router.post("/click/{slug}")
async def log_referral_click(slug: str, db: Session = Depends(get_db)):
    """EXP-5: log a referral link click for commission attribution."""
    experience = experience_repo.get_by_slug(db, slug)
    if not experience:
        return {"logged": False}
    referral_click_repo.log(db, slug, experience.referral_url or "")
    return {"logged": True, "referral_url": experience.referral_url}


@router.get("/clicks/{slug}")
async def get_referral_click_count(slug: str, db: Session = Depends(get_db)):
    """Return total click count for a given experience slug."""
    count = referral_click_repo.count_by_slug(db, slug)
    return {"slug": slug, "clicks": count}
