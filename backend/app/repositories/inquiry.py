from sqlalchemy.orm import Session

from app.models.inquiry import Inquiry
from app.repositories.base import BaseRepository


class InquiryRepository(BaseRepository[Inquiry]):
    def get_by_source(self, db: Session, source_type: str, source_id: str | None = None) -> list[Inquiry]:
        q = db.query(self.model).filter(self.model.source_type == source_type)
        if source_id:
            q = q.filter(self.model.source_id == source_id)
        return q.order_by(self.model.created_at.desc()).all()


inquiry_repo = InquiryRepository(Inquiry)
