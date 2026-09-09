export type ExperienceCategory = "adventure" | "wellness" | "culture" | "culinary" | "water" | "aerial"
export type PropertyType = "apartment" | "villa" | "riad" | "ryokan" | "gite" | "hotel" | "bivouac"
export type ProductType = "guide" | "itinerary" | "course" | "map" | "photography" | "template"

export interface Experience {
  id: string
  slug: string
  title: string
  description: string
  category: ExperienceCategory
  country?: string
  location: string
  duration?: string
  priceMin: number | null
  priceMax: number | null
  currency: string
  images: string[]
  isFeatured: boolean
  providerName: string
  providerContact: string | null
  referralUrl: string | null
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  type: PropertyType
  country?: string
  location: string
  priceMin: number | null
  priceMax: number | null
  currency: string
  images: string[]
  listingTier: string
  ownerContact: string | null
  amenities: string[]
  videoUrl: string | null
}

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  type: ProductType
  price: number
  currency: string
  imageUrl: string
  videoUrl: string | null
  purchaseUrl: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  publishedAt: string
  tags: string[]
}

export interface InquiryPayload {
  name: string
  email: string
  phone?: string
  message: string
  subject: string
  sourceType?: string
  sourceId?: string
}

// Symbol/label for currencies that don't render well via a raw prefix (e.g.
// MAD is conventionally written as a "dh" suffix, not a "MAD" prefix). Falls
// back to the currency code itself as a suffix for anything not listed.
const CURRENCY_DISPLAY: Record<string, { symbol: string; position: "prefix" | "suffix" }> = {
  EUR: { symbol: "€", position: "prefix" },
  USD: { symbol: "$", position: "prefix" },
  GBP: { symbol: "£", position: "prefix" },
  MAD: { symbol: "dh", position: "suffix" },
}

export function formatAmount(amount: number, currency: string, decimals?: number): string {
  const display = CURRENCY_DISPLAY[currency] ?? { symbol: currency, position: "suffix" as const }
  const value = decimals != null ? amount.toFixed(decimals) : String(amount)
  return display.position === "prefix" ? `${display.symbol}${value}` : `${value} ${display.symbol}`
}

export function formatPriceRange(min: number | null, max: number | null, currency = "EUR", suffix = ""): string {
  if (min == null && max == null) return ""
  const tail = suffix ? ` ${suffix}` : ""
  if (min != null && max != null) return `${formatAmount(min, currency)}–${formatAmount(max, currency)}${tail}`
  if (min != null) return `From ${formatAmount(min, currency)}${tail}`
  return `Up to ${formatAmount(max!, currency)}${tail}`
}
