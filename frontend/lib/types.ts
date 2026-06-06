export type ExperienceCategory = "adventure" | "wellness" | "cultural" | "water" | "aerial"
export type PropertyType = "apartment" | "villa" | "vacation-home" | "local-stay"
export type ProductType = "guide" | "map" | "photography" | "template"

export interface Experience {
  id: string
  slug: string
  title: string
  description: string
  category: ExperienceCategory
  priceRange: string
  location: string
  imageUrl: string
  providerName: string
  referralUrl: string
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  type: PropertyType
  priceRange: string
  location: string
  imageUrl: string
  contactUrl: string
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
}
