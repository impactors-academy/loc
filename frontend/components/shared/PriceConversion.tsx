import { detectVisitorCurrency } from "@/lib/currency-detect"
import { api } from "@/lib/api"
import { formatAmount } from "@/lib/types"

interface Props {
  min: number | null
  max: number | null
  currency: string
}

// "≈" estimate next to a listing's real price, in the visitor's local
// currency when we can tell what that is (see currency-detect.ts) and it
// differs from the listing's own currency. Never the number of record —
// the listing's own currency/price stays authoritative everywhere else
// (JSON-LD, inquiries, the admin). Fails silently: no header, FX source
// down, or same currency all just render nothing.
export async function PriceConversion({ min, max, currency }: Props) {
  if (min == null) return null

  const visitorCurrency = await detectVisitorCurrency()
  if (!visitorCurrency || visitorCurrency === currency) return null

  let rate: number | undefined
  try {
    const { rates } = await api.fx.rates(currency)
    rate = rates[visitorCurrency]
  } catch {
    return null
  }
  if (!rate) return null

  const convert = (n: number) => Math.round(n * rate!)

  return (
    <p className="text-xs text-loc-stone mt-1">
      ≈ {max != null && max !== min
        ? `${formatAmount(convert(min), visitorCurrency)}–${formatAmount(convert(max), visitorCurrency)}`
        : formatAmount(convert(min), visitorCurrency)}
    </p>
  )
}
