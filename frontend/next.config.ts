import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` on styles is unavoidable here: the app styles heavily with
 * React `style={{}}` props, which emit inline style attributes, and next/font
 * injects an inline <style> block. Removing it would mean rewriting every
 * styled element, and a policy nobody can ship is worth less than one that is
 * actually enforced.
 *
 * Scripts also need it, because Next.js inlines its bootstrap and flight data
 * as inline <script> tags. Nonces are the real fix and they require rendering
 * every page dynamically to generate one per request — a trade this marketing
 * site should not make for its static pages. So the policy is honest about what
 * it does buy: no external script origins, no framing, no plugins, and images
 * and connections limited to hosts we actually use.
 */
const apiOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return "";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  // next/font/google self-hosts the font files at build time, so no external
  // font origin is needed at runtime.
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://images.unsplash.com",
  // The browser calls the API host directly, so connect-src has to name it.
  // Derived from NEXT_PUBLIC_API_URL rather than hard-coded: in development
  // that is http://localhost:8000, and a hard-coded production host would block
  // every API call locally with a CSP error rather than an obvious failure.
  `connect-src 'self' ${apiOrigin}`,
  "media-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors above supersedes this for modern browsers; kept for old ones.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Cloudflare terminates TLS in front of this, but the header has to come from
  // somewhere and the origin is the honest place for it.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  output: process.env.NEXT_BUILD_STANDALONE === "true" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
