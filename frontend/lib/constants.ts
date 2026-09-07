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

export const COUNTRIES = [
  { label: "Japan", value: "Japan" },
  { label: "France", value: "France" },
  { label: "Morocco", value: "Morocco" },
  { label: "Bali", value: "Bali" },
  { label: "Greece", value: "Greece" },
  { label: "UK", value: "United Kingdom" },
  { label: "Italy", value: "Italy" },
  { label: "Belgium", value: "Belgium" },
]

export const PROPERTY_TYPES = [
  { label: "All", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Ryokan", value: "ryokan" },
  { label: "Gîte", value: "gite" },
  { label: "Riad", value: "riad" },
  { label: "Hotel", value: "hotel" },
  { label: "Bivouac", value: "bivouac" },
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

export const CURRENCIES = [
  { label: "EUR (€)", value: "EUR" },
  { label: "USD ($)", value: "USD" },
  { label: "GBP (£)", value: "GBP" },
  { label: "MAD (dh)", value: "MAD" },
]

// Value must match a key in components/features/stays/amenity-icons.ts —
// that's what renders the icon next to each label on the listing page.
export const PROPERTY_AMENITIES = [
  { label: "Private pool", value: "pool" },
  { label: "WiFi", value: "wifi" },
  { label: "Air conditioning", value: "ac" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Free parking", value: "parking" },
  { label: "Washer", value: "washer" },
  { label: "TV", value: "tv" },
  { label: "Heating", value: "heating" },
  { label: "Dedicated workspace", value: "workspace" },
  { label: "Pets allowed", value: "pets" },
  { label: "Breakfast included", value: "breakfast" },
  { label: "Hot tub", value: "hot_tub" },
  { label: "BBQ area", value: "bbq" },
  { label: "Sea view", value: "sea_view" },
  { label: "Mountain view", value: "mountain_view" },
  { label: "Gym", value: "gym" },
]
