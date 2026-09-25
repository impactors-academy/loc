from datetime import datetime, timedelta, timezone

from app.models.inquiry import Inquiry


def test_leads_list_is_newest_first(client, db, monkeypatch):
    from app.core import deps

    monkeypatch.setattr(deps.settings, "editor_api_key", "test-key")
    now = datetime.now(timezone.utc)
    rows = [
        Inquiry(name=f"n{i}", email=f"n{i}@example.com", message="m", subject="s",
                created_at=now - timedelta(days=i))
        for i in (3, 1, 2)
    ]
    db.add_all(rows)
    db.commit()
    try:
        res = client.get("/api/v1/leads/", headers={"X-API-Key": "test-key"})
        assert res.status_code == 200, res.text
        names = [r["name"] for r in res.json() if r["name"] in {"n1", "n2", "n3"}]
        assert names == ["n1", "n2", "n3"]
    finally:
        for r in rows:
            db.delete(r)
        db.commit()
