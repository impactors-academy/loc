import { NextRequest, NextResponse } from "next/server"
import { createRemoteJWKSet, jwtVerify } from "jose"

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

export async function middleware(req: NextRequest) {
  // Unconfigured. In production that is a broken deployment, not a reason to
  // serve the admin surface unauthenticated. Locally there is no Access in
  // front of you, so the check has nothing to verify and stands aside.
  if (!JWKS || !AUD) {
    if (process.env.NODE_ENV === "production") {
      return deny(503, "Cloudflare Access is not configured on this deployment — admin is disabled.")
    }
    return NextResponse.next()
  }

  // Access sends the assertion as a header; the cookie is the fallback for
  // browser navigations that did not go through the header-setting path.
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
    // Deliberately not echoing the parse error — it would tell an unauthenticated
    // caller which part of the token they got wrong.
    return deny(403, "Invalid Cloudflare Access token.")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
