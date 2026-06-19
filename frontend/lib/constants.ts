export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export const QUERY_KEYS = {
  experiences: ["experiences"] as const,
  experience: (slug: string) => ["experiences", slug] as const,
  properties: ["properties"] as const,
  property: (slug: string) => ["properties", slug] as const,
  products: ["products"] as const,
  product: (slug: string) => ["products", slug] as const,
  blogPosts: ["blog-posts"] as const,
  blogPost: (slug: string) => ["blog-posts", slug] as const,
} as const

export const EXPERIENCE_CATEGORIES = [
  { label: "All", value: "" },
  { label: "Adventure", value: "adventure" },
  { label: "Wellness", value: "wellness" },
  { label: "Cultural", value: "culture" },
  { label: "Culinary", value: "culinary" },
  { label: "Water", value: "water" },
  { label: "Aerial", value: "aerial" },
]

export const PROPERTY_TYPES = [
  { label: "All", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Ryokan", value: "ryokan" },
  { label: "Gîte", value: "gite" },
  { label: "Riad", value: "riad" },
  { label: "Hotel", value: "hotel" },
]

export const NAV_LINKS = [
  { label: "Experiences", href: "/experiences" },
  { label: "Stays", href: "/stays" },
  { label: "Blog", href: "/blog" },
  { label: "Store", href: "/store" },
  { label: "Promote", href: "/promote" },
]

export const SITE_NAME = "LOC"
export const SITE_TAGLINE = "Discover the World"
