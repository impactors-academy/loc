import { headers } from "next/headers"

// Cloudflare adds `cf-ipcountry` at the edge for every proxied (orange-cloud)
// request — no geo-IP service to call, no client-side permission prompt, and
// it fails safe: locally or behind a different proxy the header is just
// absent and callers get null, same as "don't show a conversion."
const COUNTRY_CURRENCY: Record<string, string> = {
  MA: "MAD",
  US: "USD", CA: "USD",
  GB: "GBP",
  AU: "AUD", NZ: "AUD",
  JP: "JPY",
  CH: "CHF",
  // Eurozone
  FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", PT: "EUR", NL: "EUR",
  BE: "EUR", IE: "EUR", AT: "EUR", GR: "EUR", FI: "EUR", LU: "EUR",
}

export async function detectVisitorCurrency(): Promise<string | null> {
  const h = await headers()
  const country = h.get("cf-ipcountry")
  if (!country) return null
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? null
}
