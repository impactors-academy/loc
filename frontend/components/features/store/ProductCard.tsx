import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

const TYPE_GRADIENTS: Record<string, string> = {
  guide: "from-amber-950 via-orange-900 to-amber-800",
  map: "from-teal-950 via-emerald-900 to-teal-800",
  photography: "from-rose-950 via-pink-900 to-rose-800",
  template: "from-indigo-950 via-blue-900 to-indigo-800",
}

const TYPE_ICONS: Record<string, string> = {
  guide: "📖",
  map: "🗺️",
  photography: "📷",
  template: "📋",
}

const TYPE_LABELS: Record<string, string> = {
  guide: "Travel Guide",
  map: "Map",
  photography: "Photography",
  template: "Template",
}

export function ProductCard({ product }: { product: Product }) {
  const gradient = TYPE_GRADIENTS[product.type] ?? "from-neutral-900 via-neutral-800 to-neutral-700"
  const icon = TYPE_ICONS[product.type] ?? "📦"
  const typeLabel = TYPE_LABELS[product.type] ?? product.type

  return (
    <article className="group rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden",
            !product.imageUrl && `bg-gradient-to-b ${gradient}`
          )}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-25 select-none">{icon}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 text-loc-night text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            {typeLabel}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-loc-night text-base leading-snug line-clamp-2 mb-2">
          {product.title}
        </h3>
        <p className="text-loc-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <span className="font-heading text-lg font-bold text-loc-terracotta">
            €{product.price.toFixed(2)}
          </span>
          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-loc-terracotta text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-loc-terracotta/90 transition-all hover:scale-[1.03]"
            aria-label={`Buy ${product.title}`}
          >
            Buy now <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </article>
  )
}
