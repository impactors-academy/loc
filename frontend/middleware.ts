import { NextRequest, NextResponse } from "next/server"
import { createRemoteJWKSet, jwtVerify } from "jose"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

/**
 * Verifies the Cloudflare Access JWT at the origin.
 *
 * Access already gates /admin and /api/admin at the edge — that is layer one.
 * This is layer two, and it exists because layer one is only enforced for
 * traffic that actually goes through Cloudflare. A request that reaches the
 * container directly (origin IP, an internal network hop, a deleted or
 * mis-scoped Access policy) never sees the edge at all.
 *
 * That matters more here than on a typical admin page, because
 * /api/admin/[...path] attaches EDITOR_API_KEY to everything it forwards. It
 * carries no authentication of its own by design, so without this check any
 * request that lands on the origin is a fully authorised write to the API —
 * and a read of every lead record.
 *
 * Fail-closed, matching require_editor_key in the backend: if the Access
 * config is missing in production we deny rather than wave traffic through.
 */

const TEAM_DOMAIN = process.env.CF_ACCESS_TEAM_DOMAIN
const AUD = process.env.CF_ACCESS_AUD

const JWKS = TEAM_DOMAIN
  ? createRemoteJWKSet(new URL(`https://${TEAM_DOMAIN}/cdn-cgi/access/certs`))
  : null

function deny(status: number, detail: string) {
  return NextResponse.json({ detail }, { status })
}

const intlMiddleware = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes: verify Cloudflare Access JWT
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Unconfigured. In production that is a broken deployment, not a reason to
    // serve the admin surface unauthenticated. Locally there is no Access in
    // front of you, so the check has nothing to verify and stands aside.
    if (!JWKS || !AUD) {
      if (process.env.NODE_ENV === "production") {
        return deny(503, "Cloudflare Access is not configured on this deployment. Admin is disabled.")
      }
      return NextResponse.next()
    }

    const token =
      req.headers.get("Cf-Access-Jwt-Assertion") ?? req.cookies.get("CF_Authorization")?.value

    if (!token) {
      return deny(403, "Missing Cloudflare Access token.")
    }

    try {
      await jwtVerify(token, JWKS, {
        issuer: `https://${TEAM_DOMAIN}`,
        audience: AUD,
      })
    } catch {
      return deny(403, "Invalid Cloudflare Access token.")
    }

    return NextResponse.next()
  }

  // API routes: pass through without locale handling
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // All other routes: handle locale detection and routing
  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!_next|icons|images|videos|fonts|favicon|apple-icon|icon|manifest|robots|sitemap).*)"],
}
