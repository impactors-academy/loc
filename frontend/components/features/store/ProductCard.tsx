"use client"

import { Link } from "@/i18n/navigation"
import { formatAmount } from "@/lib/types"
import type { Product } from "@/lib/types"
import { BookOpen, Camera, ClipboardList, ExternalLink, GraduationCap, Map, Package, Route, type LucideIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const TYPE_ICONS: Record<string, LucideIcon> = {
  guide: BookOpen,
  map: Map,
  photography: Camera,
  template: ClipboardList,
  itinerary: Route,
  course: GraduationCap,
}

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("common")
  const tp = useTranslations("productTypes")
  const Icon = TYPE_ICONS[product.type] ?? Package
  const typeLabel = tp.has(product.type) ? tp(product.type) : product.type

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-loc-night">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-loc-night via-loc-slate to-loc-terracotta" aria-hidden="true">
            <Icon size={56} strokeWidth={1.25} className="text-white/30" />
          </div>
        )}
        <span className="glass-light absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full">
          <Icon size={13} aria-hidden="true" />
          {typeLabel}
        </span>
      </div>

      <div className="pt-4 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-loc-night text-lg leading-snug line-clamp-2">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-loc-terracotta focus-visible:after:rounded-[20px]"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-loc-stone text-sm leading-relaxed line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between gap-3 mt-4">
          <span className="font-heading text-xl font-semibold text-loc-night tabular-nums">
            {formatAmount(product.price, product.currency, 2)}
          </span>
          {/* Sits above the card's stretched link so it stays its own target. */}
          <a
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary relative z-10 inline-flex items-center gap-1.5 h-10 text-sm font-semibold px-4 rounded-full"
            aria-label={`${t("buyNow")}: ${product.title}`}
          >
            {t("buyNow")} <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}
