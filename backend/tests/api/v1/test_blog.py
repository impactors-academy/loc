def test_author_and_reviewer_round_trip(client, monkeypatch):
    # The author box under each post reads these two slugs back from the API.
    from app.core import deps

    monkeypatch.setattr(deps.settings, "editor_api_key", "test-key")
    headers = {"X-API-Key": "test-key"}
    slug = "author-box-post"

    created = client.post(
        "/api/v1/blog/",
        json={"slug": slug, "title": "Post", "authorSlug": "lewis-rogers", "reviewerSlug": "emmanuel-morris"},
        headers=headers,
    )
    assert created.status_code == 201, created.text
    try:
        body = client.get(f"/api/v1/blog/{slug}").json()
        assert body["authorSlug"] == "lewis-rogers"
        assert body["reviewerSlug"] == "emmanuel-morris"
    finally:
        client.delete(f"/api/v1/blog/{slug}", headers=headers)


def test_author_and_reviewer_are_optional(client, monkeypatch):
    from app.core import deps

    monkeypatch.setattr(deps.settings, "editor_api_key", "test-key")
    headers = {"X-API-Key": "test-key"}
    slug = "no-author-post"

    created = client.post("/api/v1/blog/", json={"slug": slug, "title": "Post"}, headers=headers)
    assert created.status_code == 201, created.text
    try:
        body = client.get(f"/api/v1/blog/{slug}").json()
        assert body["authorSlug"] is None
        assert body["reviewerSlug"] is None
    finally:
        client.delete(f"/api/v1/blog/{slug}", headers=headers)
