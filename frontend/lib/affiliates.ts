export type AffiliateCat = "flights" | "insurance" | "cars" | "hotels"

export interface AffiliateLink {
  label: string
  description: string
  url: string
  category: AffiliateCat
}

// Replace each URL with your real affiliate / tracked link
export const GLOBAL_AFFILIATES: AffiliateLink[] = [
  {
    label: "Find flights",
    description: "Compare prices across hundreds of airlines",
    url: "https://www.skyscanner.com",
    category: "flights",
  },
  {
    label: "Travel insurance",
    description: "Protect your trip from the unexpected",
    url: "https://www.worldnomads.com",
    category: "insurance",
  },
  {
    label: "Car rental",
    description: "Freedom to explore at your own pace",
    url: "https://www.rentalcars.com",
    category: "cars",
  },
]

// Country-specific overrides — add entries as you sign up per-market partners
const COUNTRY_OVERRIDES: Record<string, Partial<AffiliateLink>[]> = {
  Japan: [
    { label: "Flights to Japan", url: "https://www.skyscanner.com/flights-to/jp/japan-flights.html", category: "flights" },
  ],
  Morocco: [
    { label: "Flights to Morocco", url: "https://www.skyscanner.com/flights-to/ma/morocco-flights.html", category: "flights" },
  ],
  France: [
    { label: "Flights to France", url: "https://www.skyscanner.com/flights-to/fr/france-flights.html", category: "flights" },
  ],
  Bali: [
    { label: "Flights to Bali", url: "https://www.skyscanner.com/flights-to/dps/bali-flights.html", category: "flights" },
  ],
  Greece: [
    { label: "Flights to Greece", url: "https://www.skyscanner.com/flights-to/gr/greece-flights.html", category: "flights" },
  ],
  "United Kingdom": [
    { label: "Flights to UK", url: "https://www.skyscanner.com/flights-to/uk/united-kingdom-flights.html", category: "flights" },
  ],
  Italy: [
    { label: "Flights to Italy", url: "https://www.skyscanner.com/flights-to/it/italy-flights.html", category: "flights" },
  ],
  Belgium: [
    { label: "Flights to Belgium", url: "https://www.skyscanner.com/flights-to/be/belgium-flights.html", category: "flights" },
  ],
}

export function getAffiliates(country?: string): AffiliateLink[] {
  const base = [...GLOBAL_AFFILIATES]
  if (!country) return base
  const overrides = COUNTRY_OVERRIDES[country] ?? []
  // Replace the flights entry with country-specific one if present
  const flightOverride = overrides.find((o) => o.category === "flights")
  if (flightOverride) {
    const idx = base.findIndex((a) => a.category === "flights")
    if (idx !== -1) base[idx] = { ...base[idx], ...flightOverride } as AffiliateLink
  }
  return base
}
