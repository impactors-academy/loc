import logging

from sqlalchemy.orm import Session

from app.models.inquiry import Inquiry
from app.repositories.inquiry import inquiry_repo
from app.schemas.contact import InquiryCreate, InquiryResponse

logger = logging.getLogger(__name__)


class ContactService:
    def handle_inquiry(self, db: Session, payload: InquiryCreate) -> InquiryResponse:
        inquiry = Inquiry(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            message=payload.message,
            subject=payload.subject,
            source_type=payload.source_type,
            source_id=payload.source_id,
        )
        inquiry_repo.create(db, inquiry)
        self._notify_partner(inquiry)
        return InquiryResponse(success=True)

    def _notify_partner(self, inquiry: Inquiry) -> None:
        # TODO: send email via SendGrid/SMTP when email credentials are configured
        logger.info(
            "New inquiry from %s (%s) — subject: %s [source: %s/%s]",
            inquiry.name,
            inquiry.email,
            inquiry.subject,
            inquiry.source_type,
            inquiry.source_id,
        )


contact_service = ContactService()
