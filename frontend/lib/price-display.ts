import { detectVisitorCurrency } from "./currency-detect"
import { api } from "./api"

export interface VisitorPriceContext {
  currency: string
  /** USD-based table: rates[X] = how many X per 1 USD. rates.USD is always 1. */
  rates: Record<string, number>
}

// Server-only (detectVisitorCurrency reads next/headers) — call once per page
// and pass the result down as a prop to client components (PropertyCard etc.)
// rather than having every card fetch it independently.
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

// Pure — safe to call from a client component once the context has been
// fetched server-side and passed down as a prop.
export function convertAmount(amount: number, from: string, to: string, rates: Record<string, number>): number | null {
  if (from === to) return amount
  const fromRate = rates[from]
  const toRate = rates[to]
  if (!fromRate || !toRate) return null
  return (amount / fromRate) * toRate
}
