export interface VisitorPriceContext {
  currency: string
  /** USD-based table: rates[X] = how many X per 1 USD. rates.USD is always 1. */
  rates: Record<string, number>
}

// Pure — no next/headers import here. PriceDisplay.tsx (used inside the
// client PropertyCard tree) imports only this file; if it pulled in
// currency-detect.ts's `headers()` call transitively, the build fails with
// "next/headers ... not supported in the pages/ directory" even though the
// server-only getVisitorPriceContext (price-display-context.ts) is never
// actually called from client code.
export function convertAmount(amount: number, from: string, to: string, rates: Record<string, number>): number | null {
  if (from === to) return amount
  const fromRate = rates[from]
  const toRate = rates[to]
  if (!fromRate || !toRate) return null
  return (amount / fromRate) * toRate
}
