import type { Property } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import Link from "next/link"

const TYPE_GRADIENTS: Record<string, string> = {
  "local-stay": "from-rose-950 via-pink-900 to-rose-800",
  villa: "from-emerald-950 via-teal-900 to-emerald-800",
  apartment: "from-indigo-950 via-blue-900 to-indigo-800",
  "vacation-home": "from-amber-950 via-orange-900 to-amber-800",
}

const TYPE_ICONS: Record<string, string> = {
  "local-stay": "🏮",
  villa: "🌿",
  apartment: "🏙️",
  "vacation-home": "🏡",
}

const TYPE_LABELS: Record<string, string> = {
  "local-stay": "Local Stay",
  villa: "Villa",
  apartment: "Apartment",
  "vacation-home": "Vacation Home",
}

export function PropertyCard({ property }: { property: Property }) {
  const gradient =
    TYPE_GRADIENTS[property.type] ?? "from-neutral-900 via-neutral-800 to-neutral-700"
  const icon = TYPE_ICONS[property.type] ?? "🏡"
  const typeLabel = TYPE_LABELS[property.type] ?? property.type
  const hasImage = Boolean(property.imageUrl)

  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image or gradient placeholder */}
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          !hasImage && `bg-gradient-to-b ${gradient}`
        )}
      >
        {hasImage ? (
          <img
            src={property.imageUrl}
            alt={`${property.title} in ${property.location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30 select-none">{icon}</span>
          </div>
        )}
        {/* Property type badge */}
        <span className="absolute top-3 left-3 bg-white/90 text-loc-night text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
          {typeLabel}
        </span>
      </div>

      {/* Content */}
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
          <span className="text-loc-terracotta font-semibold text-sm">{property.priceRange}</span>
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
