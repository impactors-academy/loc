import type { Experience } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import Link from "next/link"

const CATEGORY_GRADIENTS: Record<string, string> = {
  adventure: "from-amber-950 via-orange-900 to-amber-800",
  wellness: "from-emerald-950 via-teal-900 to-emerald-800",
  cultural: "from-purple-950 via-indigo-900 to-purple-800",
  water: "from-blue-950 via-cyan-900 to-blue-800",
  aerial: "from-sky-950 via-blue-900 to-sky-800",
}

const CATEGORY_ICONS: Record<string, string> = {
  adventure: "🏜️",
  wellness: "🧘",
  cultural: "🕌",
  water: "🌊",
  aerial: "🎈",
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  const gradient =
    CATEGORY_GRADIENTS[experience.category] ?? "from-neutral-900 via-neutral-800 to-neutral-700"
  const icon = CATEGORY_ICONS[experience.category] ?? "✨"
  const hasImage = Boolean(experience.imageUrl)

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
            src={experience.imageUrl}
            alt={`${experience.title} in ${experience.location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30 select-none">{icon}</span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-loc-terracotta text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
          {experience.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-loc-stone text-xs mb-2">
          <MapPin size={11} aria-hidden="true" />
          <span>{experience.location}</span>
        </div>
        <h3 className="font-heading font-bold text-loc-night text-lg leading-snug line-clamp-2 mb-2">
          {experience.title}
        </h3>
        <p className="text-loc-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {experience.description}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <span className="text-loc-terracotta font-semibold text-sm">{experience.priceRange}</span>
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
