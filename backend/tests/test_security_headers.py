"""The headers are the whole point of the middleware, so assert them directly."""


def test_security_headers_present_on_api_response(client):
    res = client.get("/health")
    assert res.headers["X-Content-Type-Options"] == "nosniff"
    assert res.headers["X-Frame-Options"] == "DENY"
    assert res.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    assert "camera=()" in res.headers["Permissions-Policy"]
    assert "frame-ancestors 'none'" in res.headers["Content-Security-Policy"]


def test_hsts_absent_over_plain_http(client):
    """Sending HSTS over http is ignored by browsers, and on localhost it would
    pin the host to https for two years. It must only appear on https."""
    res = client.get("/health")
    assert "Strict-Transport-Security" not in res.headers


def test_hsts_present_when_proxy_reports_https(client):
    res = client.get("/health", headers={"x-forwarded-proto": "https"})
    assert "max-age=" in res.headers["Strict-Transport-Security"]


def test_headers_present_on_error_responses(client):
    """A 404 is still a response an attacker can reach — it needs the headers too."""
    res = client.get("/api/v1/experiences/definitely-not-a-real-slug")
    assert res.status_code == 404
    assert res.headers["X-Content-Type-Options"] == "nosniff"
