import { formatPriceRange } from "@/lib/types"
import type { Experience } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Clock, Globe, MapPin } from "lucide-react"
import Link from "next/link"

const CATEGORY_GRADIENTS: Record<string, string> = {
  adventure: "from-amber-950 via-orange-900 to-amber-800",
  wellness: "from-emerald-950 via-teal-900 to-emerald-800",
  culture: "from-purple-950 via-indigo-900 to-purple-800",
  culinary: "from-red-950 via-rose-900 to-red-800",
  water: "from-blue-950 via-cyan-900 to-blue-800",
  aerial: "from-sky-950 via-blue-900 to-sky-800",
}

const CATEGORY_ICONS: Record<string, string> = {
  adventure: "🏜️",
  wellness: "🧘",
  culture: "🏯",
  culinary: "🍷",
  water: "🌊",
  aerial: "🎈",
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  const gradient =
    CATEGORY_GRADIENTS[experience.category] ?? "from-neutral-900 via-neutral-800 to-neutral-700"
  const icon = CATEGORY_ICONS[experience.category] ?? "✨"
  const mainImage = experience.images?.[0]
  const priceDisplay = formatPriceRange(experience.priceMin, experience.priceMax, "/ person")

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
            alt={`${experience.title} in ${experience.location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30 select-none">{icon}</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-loc-terracotta text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
          {experience.category}
        </span>
        {experience.isFeatured && (
          <span className="absolute top-3 right-3 bg-loc-amber text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-loc-stone text-xs mb-2 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin size={11} aria-hidden="true" />
            {experience.location}
          </span>
          {experience.country && (
            <span className="flex items-center gap-1">
              <Globe size={11} aria-hidden="true" />
              {experience.country}
            </span>
          )}
          {experience.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} aria-hidden="true" />
              {experience.duration}
            </span>
          )}
        </div>
        <h3 className="font-heading font-bold text-loc-night text-lg leading-snug line-clamp-2 mb-2">
          {experience.title}
        </h3>
        <p className="text-loc-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {experience.description}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <span className="text-loc-terracotta font-semibold text-sm">{priceDisplay}</span>
          <Link
            href={`/experiences/${experience.slug}`}
            className="text-xs font-semibold text-loc-night bg-loc-sand hover:bg-loc-sand/70 px-4 py-2 rounded-full transition-colors"
            aria-label={`View details for ${experience.title}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
