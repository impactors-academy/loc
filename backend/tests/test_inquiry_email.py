import httpx
import pytest

from app.config import settings
from app.models.inquiry import Inquiry
from app.services import contact
from app.services.contact import as_email, build_notification, send_via_resend


def make_inquiry(**overrides):
    fields = {
        "id": "inq-1",
        "name": "Jane <b>Traveler</b>",
        "email": "jane@example.com",
        "phone": None,
        "message": 'Hi <a href="https://evil.example">click</a>',
        "subject": "Villa in October",
        "source_type": "property",
        "source_id": "sea-villa",
    }
    return Inquiry(**{**fields, **overrides})


@pytest.fixture
def enabled(monkeypatch):
    monkeypatch.setattr(settings, "resend_api_key", "re_test")
    monkeypatch.setattr(settings, "email_to", "team@loctravels.com")
    monkeypatch.setattr(settings, "email_from", "noreply@loctravels.com")


def test_disabled_without_key_or_inbox(monkeypatch):
    monkeypatch.setattr(settings, "resend_api_key", "")
    monkeypatch.setattr(settings, "email_to", "team@loctravels.com")
    assert build_notification(make_inquiry(), None) is None
    monkeypatch.setattr(settings, "resend_api_key", "re_test")
    monkeypatch.setattr(settings, "email_to", "")
    assert build_notification(make_inquiry(), None) is None


def test_partner_gets_it_and_team_is_copied(enabled):
    msg = build_notification(make_inquiry(), "owner@villa.example")
    assert msg["to"] == ["owner@villa.example"]
    assert msg["cc"] == ["team@loctravels.com"]
    assert msg["reply_to"] == "jane@example.com"
    assert msg["from"] == "LOC <noreply@loctravels.com>"
    assert msg["subject"] == "[LOC Lead] Villa in October"


def test_team_only_when_no_partner_email(enabled):
    msg = build_notification(make_inquiry(), None)
    assert msg["to"] == ["team@loctravels.com"]
    assert "cc" not in msg


def test_traveller_text_is_escaped_in_html_but_plain_in_text(enabled):
    msg = build_notification(make_inquiry(), None)
    assert "<b>Traveler</b>" not in msg["html"]
    assert "&lt;b&gt;Traveler&lt;/b&gt;" in msg["html"]
    assert 'href="https://evil.example"' not in msg["html"]
    assert 'Hi <a href="https://evil.example">click</a>' in msg["text"]


@pytest.mark.parametrize(
    "value,expected",
    [
        ("owner@villa.example", "owner@villa.example"),
        ("  owner@villa.example  ", "owner@villa.example"),
        ("+212 600 000 000", None),
        ("", None),
        (None, None),
    ],
)
def test_as_email_only_accepts_real_addresses(value, expected):
    assert as_email(value) == expected


def test_send_failure_is_logged_not_raised(enabled, monkeypatch, caplog):
    def boom(*args, **kwargs):
        raise httpx.ConnectError("down")

    monkeypatch.setattr(contact.httpx, "post", boom)
    send_via_resend({"to": ["x@example.com"]})
    assert "Failed to send inquiry notification email" in caplog.text


def test_resend_error_status_is_logged(enabled, monkeypatch, caplog):
    captured = {}

    def fake_post(url, headers, json, timeout):
        captured.update(url=url, auth=headers["Authorization"])
        return httpx.Response(422, text='{"message":"domain not verified"}')

    monkeypatch.setattr(contact.httpx, "post", fake_post)
    send_via_resend({"to": ["x@example.com"]})
    assert captured == {"url": "https://api.resend.com/emails", "auth": "Bearer re_test"}
    assert "domain not verified" in caplog.text
