import { MapPinned } from "lucide-react"

interface Props {
  location: string
  country?: string
}

// A link-out to Google Maps search, not an embedded map — no API key, no
// geocoding, no cost, and it works from just the free-text location/country
// fields that already exist. An embedded map needs a geocoded lat/lng, which
// none of these listings have; upgrade path if that's added later.
export function MapLink({ location, country }: Props) {
  const query = encodeURIComponent([location, country].filter(Boolean).join(", "))
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${query}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-loc-terracotta hover:underline"
    >
      <MapPinned className="w-4 h-4" />
      Open in Maps
    </a>
  )
}
