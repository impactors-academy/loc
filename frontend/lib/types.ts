export type ExperienceCategory = "adventure" | "wellness" | "cultural" | "water" | "aerial"
export type PropertyType = "apartment" | "villa" | "vacation-home" | "local-stay"
export type ProductType = "guide" | "map" | "photography" | "template"

export interface Experience {
  id: string
  slug: string
  title: string
  description: string
  category: ExperienceCategory
  location: string
  priceMin: number | null
  priceMax: number | null
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
  location: string
  priceMin: number | null
  priceMax: number | null
  images: string[]
  listingTier: string
  ownerContact: string | null
}

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  type: ProductType
  price: number
  imageUrl: string
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

export function formatPriceRange(min: number | null, max: number | null, suffix = ""): string {
  if (min == null && max == null) return ""
  if (min != null && max != null) return `€${min}–€${max}${suffix ? ` ${suffix}` : ""}`
  if (min != null) return `From €${min}${suffix ? ` ${suffix}` : ""}`
  return `Up to €${max!}${suffix ? ` ${suffix}` : ""}`
}
