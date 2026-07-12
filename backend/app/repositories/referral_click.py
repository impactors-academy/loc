from sqlalchemy.orm import Session

from app.models.referral_click import ReferralClick
from app.repositories.base import BaseRepository


class ReferralClickRepository(BaseRepository[ReferralClick]):
    def log(self, db: Session, experience_slug: str, referral_url: str) -> ReferralClick:
        click = ReferralClick(experience_slug=experience_slug, referral_url=referral_url)
        return self.create(db, click)

    def count_by_slug(self, db: Session, experience_slug: str) -> int:
        return db.query(self.model).filter(self.model.experience_slug == experience_slug).count()


referral_click_repo = ReferralClickRepository(ReferralClick)
