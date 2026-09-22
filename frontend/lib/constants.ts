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

// `value` only — labels are translated at the call site (public filters use
// next-intl `experienceCategories.*`/`propertyTypes.*`/`countries.*` keys;
// the admin forms, which stay English like every other admin screen, use
// `label` directly).
export const EXPERIENCE_CATEGORIES = [
  { label: "All", value: "" },
  { label: "Adventure", value: "adventure" },
  { label: "Wellness", value: "wellness" },
  { label: "Cultural", value: "culture" },
  { label: "Culinary", value: "culinary" },
  { label: "Water", value: "water" },
  { label: "Aerial", value: "aerial" },
]

// The countries LOC actually operates in (see FEATURED_CITIES history /
// LOC Phase 1 Strategy) — was previously an 8-country list including five
// with zero real listings (Japan, Bali, Greece, UK, Italy).
export const COUNTRIES = [
  { label: "Morocco", value: "Morocco" },
  { label: "France", value: "France" },
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

export const SITE_NAME = "LOC"

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
