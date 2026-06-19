import { formatPriceRange } from "@/lib/types"
import type { Property } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import Link from "next/link"

const TYPE_GRADIENTS: Record<string, string> = {
  villa: "from-emerald-950 via-teal-900 to-emerald-800",
  apartment: "from-indigo-950 via-blue-900 to-indigo-800",
  riad: "from-rose-950 via-pink-900 to-rose-800",
  ryokan: "from-amber-950 via-orange-900 to-amber-800",
  gite: "from-lime-950 via-green-900 to-lime-800",
  hotel: "from-sky-950 via-blue-900 to-sky-800",
  bivouac: "from-stone-950 via-stone-800 to-stone-700",
}

const TYPE_ICONS: Record<string, string> = {
  villa: "🌿",
  apartment: "🏙️",
  riad: "🏮",
  ryokan: "🎋",
  gite: "🏡",
  hotel: "🛎️",
  bivouac: "⛺",
}

const TYPE_LABELS: Record<string, string> = {
  villa: "Villa",
  apartment: "Apartment",
  riad: "Riad",
  ryokan: "Ryokan",
  gite: "Gîte",
  hotel: "Hotel",
  bivouac: "Bivouac",
}

const TIER_BADGE: Record<string, string> = {
  featured: "Featured",
  premium: "Premium",
}

export function PropertyCard({ property }: { property: Property }) {
  const gradient =
    TYPE_GRADIENTS[property.type] ?? "from-neutral-900 via-neutral-800 to-neutral-700"
  const icon = TYPE_ICONS[property.type] ?? "🏡"
  const typeLabel = TYPE_LABELS[property.type] ?? property.type
  const mainImage = property.images?.[0]
  const priceDisplay = formatPriceRange(property.priceMin, property.priceMax, "/ night")
  const tierLabel = TIER_BADGE[property.listingTier]

  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          !mainImage && `bg-gradient-to-b ${gradient}`
        )}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${property.title} in ${property.location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30 select-none">{icon}</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 text-loc-night text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {typeLabel}
        </span>
        {tierLabel && (
          <span className="absolute top-3 right-3 bg-loc-amber text-white text-xs font-medium px-2 py-1 rounded-full">
            {tierLabel}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-loc-stone text-xs mb-2">
          <MapPin size={11} aria-hidden="true" />
          <span>{property.location}</span>
        </div>
        <h3 className="font-heading font-bold text-loc-night text-lg leading-snug line-clamp-2 mb-2">
          {property.title}
        </h3>
        <p className="text-loc-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {property.description}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <span className="text-loc-terracotta font-semibold text-sm">{priceDisplay}</span>
          <Link
            href={`/stays/${property.slug}`}
            className="text-xs font-semibold text-loc-night bg-loc-sand hover:bg-loc-sand/70 px-4 py-2 rounded-full transition-colors"
            aria-label={`View details for ${property.title}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
