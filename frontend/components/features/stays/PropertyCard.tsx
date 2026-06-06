import type { Property } from "@/lib/types"
import Link from "next/link"

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-neutral-100">
        {property.imageUrl && (
          <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground capitalize">{property.type.replace("-", " ")}</span>
        <h3 className="font-semibold text-base mt-1">{property.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{property.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm font-medium">{property.priceRange}</span>
          <Link
            href={`/stays/${property.slug}`}
            className="text-sm font-medium text-black underline underline-offset-2 hover:opacity-70"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
