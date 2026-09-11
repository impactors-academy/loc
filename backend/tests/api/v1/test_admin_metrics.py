from app.core import deps


def test_metrics_fails_closed_when_key_unset(client, monkeypatch):
    monkeypatch.setattr(deps.settings, "editor_api_key", "")
    response = client.get("/api/v1/admin/metrics")
    assert response.status_code == 503


def test_metrics_rejects_wrong_key(client, monkeypatch):
    monkeypatch.setattr(deps.settings, "editor_api_key", "real-key")
    response = client.get("/api/v1/admin/metrics", headers={"X-API-Key": "wrong-key"})
    assert response.status_code == 403


def test_metrics_shape_with_valid_key(client, monkeypatch):
    monkeypatch.setattr(deps.settings, "editor_api_key", "real-key")
    response = client.get("/api/v1/admin/metrics", headers={"X-API-Key": "real-key"})
    assert response.status_code == 200
    body = response.json()
    assert body["inquiries"] == {"total": 0, "last_7d": 0}
    assert body["experiences"] == {"total": 0}
    assert body["properties"] == {"total": 0}
    assert body["top_destinations"] == []
    assert body["blog_posts"] == {"total": 0, "last_published_at": None}
