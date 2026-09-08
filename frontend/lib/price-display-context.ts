import { detectVisitorCurrency } from "./currency-detect"
import { api } from "./api"
import type { VisitorPriceContext } from "./price-display"

// Server-only (detectVisitorCurrency reads next/headers) — call once per
// page and pass the result down as a prop to client components
// (PropertyCard etc.) rather than having every card fetch it independently.
// Kept out of price-display.ts so that file stays safe to import from a
// client component tree — see the comment there.
export async function getVisitorPriceContext(): Promise<VisitorPriceContext | null> {
  const visitorCurrency = await detectVisitorCurrency()
  if (!visitorCurrency) return null
  try {
    const { rates } = await api.fx.rates("USD")
    return { currency: visitorCurrency, rates: { ...rates, USD: 1 } }
  } catch {
    return null
  }
}
