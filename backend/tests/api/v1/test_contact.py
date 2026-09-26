from app.core.rate_limit import limiter
from app.models.inquiry import Inquiry


def setup_function():
    # /contact/ is rate-limited at 5/minute per IP; TestClient requests all
    # share one address, so reset between tests to avoid cross-test 429s.
    limiter.reset()


VALID_PAYLOAD = {
    "name": "Jane Traveler",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "Is this experience available in October?",
    "subject": "Availability question",
    "source_type": "experience",
    "source_id": "some-experience-slug",
}


def test_submit_inquiry_creates_record(client, db):
    response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Your inquiry has been received.",
    }

    stored = db.query(Inquiry).filter(Inquiry.email == "jane@example.com").one()
    assert stored.name == "Jane Traveler"
    assert stored.subject == "Availability question"
    assert stored.source_type == "experience"
    assert stored.source_id == "some-experience-slug"


def test_submit_inquiry_defaults_source_type_to_general(client, db):
    payload = {
        "name": "Sam",
        "email": "sam@example.com",
        "message": "General question about LOC.",
        "subject": "Hello",
    }

    response = client.post("/api/v1/contact/", json=payload)

    assert response.status_code == 200
    stored = db.query(Inquiry).filter(Inquiry.email == "sam@example.com").one()
    assert stored.source_type == "general"
    assert stored.source_id is None
    assert stored.phone is None


def test_submit_inquiry_missing_required_field(client, db):
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "message"}
    before = db.query(Inquiry).count()

    response = client.post("/api/v1/contact/", json=payload)

    assert response.status_code == 422
    assert db.query(Inquiry).count() == before


def test_submit_inquiry_invalid_email(client, db):
    payload = {**VALID_PAYLOAD, "email": "not-an-email"}
    before = db.query(Inquiry).count()

    response = client.post("/api/v1/contact/", json=payload)

    assert response.status_code == 422
    assert db.query(Inquiry).count() == before


def test_submit_inquiry_logs_when_email_disabled(client, db, caplog):
    # settings.email_enabled is False in the test environment (no Resend key),
    # so the notify step logs instead of sending — without the traveller's
    # name or email, which must never reach the logs.
    import logging

    with caplog.at_level(logging.INFO):
        response = client.post("/api/v1/contact/", json=VALID_PAYLOAD)

    assert response.status_code == 200
    logged = " ".join(record.getMessage() for record in caplog.records)
    assert "New inquiry" in logged
    assert VALID_PAYLOAD["email"] not in logged
    assert VALID_PAYLOAD["name"] not in logged


def test_submit_inquiry_sends_email_after_response_when_enabled(client, db, monkeypatch):
    from app.config import settings
    from app.services import contact as contact_module

    monkeypatch.setattr(settings, "resend_api_key", "re_test")
    monkeypatch.setattr(settings, "email_to", "team@loctravels.com")
    sent = []
    monkeypatch.setattr(contact_module, "send_via_resend", lambda message: sent.append(message))

    payload = {**VALID_PAYLOAD, "source_type": "general", "source_id": None}
    response = client.post("/api/v1/contact/", json=payload)

    assert response.status_code == 200
    assert len(sent) == 1
    assert sent[0]["to"] == ["team@loctravels.com"]
    assert sent[0]["reply_to"] == VALID_PAYLOAD["email"]
