import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "fr", "es", "pt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // next-intl's own default omits `secure` entirely — confirmed live via
  // testssl.sh: NEXT_LOCALE shipped with no Secure flag despite the whole
  // site being HTTPS-only. Not `httpOnly`: next-intl's own client-side
  // navigation reads/writes this cookie directly, so it has to stay
  // script-readable. Conditional on production only — `next dev` serves
  // http://localhost, and a browser silently refuses to store an
  // explicitly Secure cookie over plain http.
  localeCookie: {
    sameSite: "lax",
    ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
  },
})
