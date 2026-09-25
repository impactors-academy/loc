def test_list_properties_empty(client):
    response = client.get("/api/v1/properties/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_property_not_found(client):
    response = client.get("/api/v1/properties/nonexistent-slug")
    assert response.status_code == 404


def test_update_without_amenities_preserves_them(client, monkeypatch):
    # The mother dashboard edits stays without sending `amenities`; a full
    # overwrite used to reset them to [] on every save.
    from app.core import deps

    monkeypatch.setattr(deps.settings, "editor_api_key", "test-key")
    headers = {"X-API-Key": "test-key"}
    slug = "partial-update-amenities"
    base = {"title": "Villa", "type": "villa", "country": "Italy"}

    created = client.post(
        "/api/v1/properties/",
        json={**base, "slug": slug, "amenities": ["pool", "wifi"]},
        headers=headers,
    )
    assert created.status_code in (200, 201), created.text

    try:
        updated = client.put(
            f"/api/v1/properties/{slug}",
            json={**base, "title": "Villa renamed"},
            headers=headers,
        )
        assert updated.status_code == 200, updated.text
        assert updated.json()["title"] == "Villa renamed"
        assert updated.json()["amenities"] == ["pool", "wifi"]

        cleared = client.put(
            f"/api/v1/properties/{slug}",
            json={**base, "amenities": []},
            headers=headers,
        )
        assert cleared.status_code == 200, cleared.text
        assert cleared.json()["amenities"] == []
    finally:
        client.delete(f"/api/v1/properties/{slug}", headers=headers)
