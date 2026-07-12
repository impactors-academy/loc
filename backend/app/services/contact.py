import logging
import smtplib
from email.mime.multipart import MIMEMultipart
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
        self._notify_partner(db, inquiry)
        return InquiryResponse(success=True)

    def _notify_partner(self, db: Session, inquiry: Inquiry) -> None:
        if not settings.email_enabled:
            logger.info(
                "New inquiry from %s (%s) — subject: %s [source: %s/%s]",
                inquiry.name,
                inquiry.email,
                inquiry.subject,
                inquiry.source_type,
                inquiry.source_id,
            )
            return

        partner_email = self._resolve_partner_email(db, inquiry)
        # Primary recipient: partner if found, otherwise LOC team inbox
        to_addr = partner_email or settings.email_to
        cc_addr = settings.email_to if (partner_email and partner_email != settings.email_to) else None

        html = f"""
        <html><body style="font-family:sans-serif;color:#1A1A2E;max-width:600px;">
          <div style="background:#C4714A;padding:20px 24px;border-radius:12px 12px 0 0;">
            <h2 style="color:#fff;margin:0;font-size:18px;">New Inquiry via LOC</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#8B7355;font-size:13px;width:120px;">Name</td>
                  <td style="padding:6px 0;font-weight:600;">{inquiry.name}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:13px;">Email</td>
                  <td style="padding:6px 0;"><a href="mailto:{inquiry.email}" style="color:#C4714A;">{inquiry.email}</a></td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:13px;">Phone</td>
                  <td style="padding:6px 0;">{inquiry.phone or "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:13px;">Subject</td>
                  <td style="padding:6px 0;">{inquiry.subject}</td></tr>
              <tr><td style="padding:6px 0;color:#8B7355;font-size:13px;">Source</td>
                  <td style="padding:6px 0;">{inquiry.source_type}/{inquiry.source_id or "—"}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
            <p style="color:#8B7355;font-size:13px;margin:0 0 6px;">Message</p>
            <p style="margin:0;white-space:pre-wrap;">{inquiry.message}</p>
          </div>
          <p style="color:#8B7355;font-size:11px;margin-top:12px;">Sent via LOC — loctravels.com</p>
        </body></html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[LOC Lead] {inquiry.subject}"
        msg["From"] = settings.email_from
        msg["To"] = to_addr
        if cc_addr:
            msg["Cc"] = cc_addr
        msg.attach(MIMEText(html, "html"))

        all_recipients = [to_addr] + ([cc_addr] if cc_addr else [])

        try:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(settings.email_from, all_recipients, msg.as_string())
        except Exception:
            logger.exception("Failed to send inquiry notification email")

    def _resolve_partner_email(self, db: Session, inquiry: Inquiry) -> str | None:
        if not inquiry.source_id:
            return None
        if inquiry.source_type == "experience":
            from app.repositories.experience import experience_repo
            exp = experience_repo.get_by_slug(db, inquiry.source_id)
            return exp.provider_contact if exp else None
        if inquiry.source_type == "property":
            from app.repositories.property import property_repo
            prop = property_repo.get_by_slug(db, inquiry.source_id)
            return prop.owner_contact if prop else None
        return None


contact_service = ContactService()
