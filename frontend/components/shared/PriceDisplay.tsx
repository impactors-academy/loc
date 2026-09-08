import { formatPriceRange } from "@/lib/types"
import { convertAmount, type VisitorPriceContext } from "@/lib/price-display"

interface Props {
  min: number | null
  max: number | null
  currency: string
  suffix?: string
  priceContext?: VisitorPriceContext | null
  /** "lg" for the detail-page price box, "sm" for grid cards. */
  size?: "sm" | "lg"
  className?: string
}

// Airbnb-style: the visitor's local currency IS the price shown, not a "≈"
// side note — this is a pure function of props (no fetching), so it works
// identically from a server page (detail pages, which already have the
// context) and a client component (PropertyCard, which gets it prop-drilled
// from the server-rendered page above it — see lib/price-display.ts).
export function PriceDisplay({ min, max, currency, suffix = "", priceContext, size = "sm", className = "" }: Props) {
  if (min == null) return null

  let displayCurrency = currency
  let displayMin = min
  let displayMax = max

  if (priceContext && priceContext.currency !== currency) {
    const convertedMin = convertAmount(min, currency, priceContext.currency, priceContext.rates)
    const convertedMax = max != null ? convertAmount(max, currency, priceContext.currency, priceContext.rates) : null
    if (convertedMin != null) {
      displayCurrency = priceContext.currency
      // Round to whole units — a converted price with decimals reads as
      // more precise than it is.
      displayMin = Math.round(convertedMin)
      displayMax = convertedMax != null ? Math.round(convertedMax) : null
    }
  }

  const converted = displayCurrency !== currency

  return (
    <span className={className}>
      <span>{formatPriceRange(displayMin, displayMax, displayCurrency, suffix)}</span>
      {converted && (
        <span className={size === "lg" ? "block text-xs text-loc-stone mt-1" : "block text-[10px] text-loc-stone/70"}>
          {formatPriceRange(min, max, currency, suffix)}
        </span>
      )}
    </span>
  )
}
