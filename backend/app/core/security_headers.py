from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Attach the standard security headers to every API response.

    The API serves JSON, not documents, so the interesting ones here are the
    sniffing and framing controls: a JSON endpoint that a browser is willing to
    interpret as HTML is the ingredient for a reflected-content attack.

    `Strict-Transport-Security` is only sent over HTTPS. Emitting it on a plain
    HTTP response is meaningless — the browser ignores it — and on local
    development it would pin localhost to HTTPS in your browser for two years,
    which is a genuinely annoying thing to undo.
    """

    # /docs and /redoc are the one place this API serves a real HTML document,
    # and Swagger UI loads its CSS and JS from a CDN. `default-src 'none'` blocks
    # both, so the page arrives as a 200 and renders blank — which looks like the
    # docs are broken rather than like a policy doing its job. These paths get a
    # policy that permits exactly what the UI needs and nothing else.
    _DOC_PATHS = ("/docs", "/redoc")
    _DOC_CSP = (
        "default-src 'none'; "
        "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
        "style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
        "img-src 'self' data: https://fastapi.tiangolo.com; "
        "font-src 'self' data:; "
        "connect-src 'self'; "
        "frame-ancestors 'none'"
    )

    def __init__(self, app, hsts: bool = True) -> None:
        super().__init__(app)
        self._hsts = hsts

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        response = await call_next(request)

        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault(
            "Permissions-Policy", "camera=(), microphone=(), geolocation=()"
        )
        # Everything except the docs returns JSON, so it needs no source at all.
        if request.url.path.rstrip("/") in self._DOC_PATHS:
            response.headers.setdefault("Content-Security-Policy", self._DOC_CSP)
        else:
            response.headers.setdefault(
                "Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'"
            )

        forwarded_proto = request.headers.get("x-forwarded-proto", request.url.scheme)
        if self._hsts and forwarded_proto == "https":
            response.headers.setdefault(
                "Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"
            )

        return response
