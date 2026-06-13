import logging
import smtplib
from email.mime.text import MIMEText

from sqlalchemy.orm import Session

from app.config import settings
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
        if not settings.smtp_host or not settings.email_to:
            logger.info(
                "New inquiry from %s (%s) — subject: %s [source: %s/%s]",
                inquiry.name,
                inquiry.email,
                inquiry.subject,
                inquiry.source_type,
                inquiry.source_id,
            )
            return

        body = (
            f"New inquiry via LOC\n\n"
            f"From: {inquiry.name} <{inquiry.email}>\n"
            f"Phone: {inquiry.phone or '—'}\n"
            f"Subject: {inquiry.subject}\n"
            f"Source: {inquiry.source_type}/{inquiry.source_id or '—'}\n\n"
            f"Message:\n{inquiry.message}"
        )

        msg = MIMEText(body)
        msg["Subject"] = f"[LOC Lead] {inquiry.subject}"
        msg["From"] = settings.email_from
        msg["To"] = settings.email_to

        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                server.send_message(msg)
        except Exception:
            logger.exception("Failed to send inquiry notification email")


contact_service = ContactService()
