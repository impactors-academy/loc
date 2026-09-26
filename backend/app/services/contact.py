import html
import logging

import httpx
from fastapi import BackgroundTasks
from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy.orm import Session

from app.config import settings
from app.models.inquiry import Inquiry
from app.repositories.inquiry import inquiry_repo
from app.schemas.contact import InquiryCreate, InquiryResponse

logger = logging.getLogger(__name__)

RESEND_URL = "https://api.resend.com/emails"
_email_adapter = TypeAdapter(EmailStr)


def as_email(value: str | None) -> str | None:
    """provider_contact / owner_contact are free text and may hold a phone number."""
    if not value:
        return None
    try:
        return str(_email_adapter.validate_python(value.strip()))
    except ValidationError:
        return None


def build_notification(inquiry: Inquiry, partner_email: str | None) -> dict | None:
    """Resend payload for a new inquiry, or None when email isn't configured."""
    if not settings.email_enabled:
        return None

    # Partner first when the listing has a real email; the LOC inbox is always copied.
    to_addr = partner_email or settings.email_to
    cc = [settings.email_to] if partner_email and partner_email != settings.email_to else []
    sender = settings.email_from if "<" in settings.email_from else f"LOC <{settings.email_from}>"
    source = f"{inquiry.source_type}/{inquiry.source_id or '—'}"

    # Everything below is traveller-submitted — escape it, or anyone can put
    # their own links and markup into an email sent from our domain.
    e = {
        k: html.escape(v or "—")
        for k, v in {
            "name": inquiry.name,
            "email": inquiry.email,
            "phone": inquiry.phone,
            "subject": inquiry.subject,
            "source": source,
            "message": inquiry.message,
        }.items()
    }

    rows = "".join(
        f'<tr><td style="padding:6px 0;color:#7F694D;font-size:13px;width:120px;">{label}</td>'
        f'<td style="padding:6px 0;">{value}</td></tr>'
        for label, value in (
            ("Name", f"<strong>{e['name']}</strong>"),
            ("Email", f'<a href="mailto:{e["email"]}" style="color:#A16036;">{e["email"]}</a>'),
            ("Phone", e["phone"]),
            ("Subject", e["subject"]),
            ("Source", e["source"]),
        )
    )
    html_body = (
        '<div style="font-family:sans-serif;color:#1A1A2E;max-width:600px;">'
        '<div style="background:#A16036;padding:20px 24px;border-radius:12px 12px 0 0;">'
        '<h2 style="color:#fff;margin:0;font-size:18px;">New inquiry via LOC</h2></div>'
        '<div style="border:1px solid #e5e7eb;border-top:none;padding:24px;'
        'border-radius:0 0 12px 12px;">'
        f'<table style="width:100%;border-collapse:collapse;">{rows}</table>'
        '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">'
        '<p style="color:#7F694D;font-size:13px;margin:0 0 6px;">Message</p>'
        f'<p style="margin:0;white-space:pre-wrap;">{e["message"]}</p></div>'
        '<p style="color:#7F694D;font-size:11px;margin-top:12px;">'
        "Reply to this email to answer the traveller directly. Sent via loctravels.com</p></div>"
    )
    text_body = (
        "New inquiry via LOC\n\n"
        f"Name: {inquiry.name}\nEmail: {inquiry.email}\nPhone: {inquiry.phone or '—'}\n"
        f"Subject: {inquiry.subject}\nSource: {source}\n\n"
        f"{inquiry.message}\n\n"
        "Reply to this email to answer the traveller directly."
    )

    message = {
        "from": sender,
        "to": [to_addr],
        "reply_to": inquiry.email,
        "subject": f"[LOC Lead] {inquiry.subject}",
        "html": html_body,
        "text": text_body,
    }
    if cc:
        message["cc"] = cc
    return message


def send_via_resend(message: dict) -> None:
    """Runs after the response is sent. Never raises: the inquiry is already saved."""
    try:
        res = httpx.post(
            RESEND_URL,
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json=message,
            timeout=10,
        )
        if res.status_code >= 400:
            logger.error(
                "Resend rejected inquiry notification: %s %s", res.status_code, res.text[:300]
            )
    except httpx.HTTPError:
        logger.exception("Failed to send inquiry notification email")


class ContactService:
    def handle_inquiry(
        self, db: Session, payload: InquiryCreate, background_tasks: BackgroundTasks
    ) -> InquiryResponse:
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

        message = build_notification(inquiry, self._resolve_partner_email(db, inquiry))
        if message is None:
            # No name/email here — the log must not carry traveller PII.
            logger.info(
                "New inquiry %s (email disabled) — subject: %s [source: %s/%s]",
                inquiry.id,
                inquiry.subject,
                inquiry.source_type,
                inquiry.source_id,
            )
        else:
            background_tasks.add_task(send_via_resend, message)
        return InquiryResponse(success=True)

    def _resolve_partner_email(self, db: Session, inquiry: Inquiry) -> str | None:
        if not inquiry.source_id:
            return None
        if inquiry.source_type == "experience":
            from app.repositories.experience import experience_repo

            exp = experience_repo.get_by_slug(db, inquiry.source_id)
            return as_email(exp.provider_contact) if exp else None
        if inquiry.source_type == "property":
            from app.repositories.property import property_repo

            prop = property_repo.get_by_slug(db, inquiry.source_id)
            return as_email(prop.owner_contact) if prop else None
        return None


contact_service = ContactService()
