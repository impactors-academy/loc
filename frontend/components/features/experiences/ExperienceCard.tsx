import type { Experience } from "@/lib/types"
import Link from "next/link"

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-neutral-100 relative">
        {experience.imageUrl && (
          <img src={experience.imageUrl} alt={experience.title} className="w-full h-full object-cover" />
        )}
        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full capitalize">
          {experience.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base">{experience.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{experience.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-medium">{experience.priceRange}</span>
          <Link
            href={`/experiences/${experience.slug}`}
            className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-70"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
