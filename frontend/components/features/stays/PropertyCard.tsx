"use client"

import type { Property } from "@/lib/types"
import type { VisitorPriceContext } from "@/lib/price-display"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { Link } from "@/i18n/navigation"
import { getPoolImage } from "@/lib/images"
import { splitTitle } from "@/lib/text"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Props {
  property: Property
  priceContext?: VisitorPriceContext | null
  className?: string
  imageClassName?: string
  sizes?: string
}

export function PropertyCard({ property, priceContext, className, imageClassName, sizes }: Props) {
  const t = useTranslations("common")
  const tp = useTranslations("propertyTypes")
  const typeLabel = tp.has(property.type) ? tp(property.type) : property.type
  const image = property.images?.[0] ?? getPoolImage(property.type, property.slug)
  const { name, detail } = splitTitle(property.title)
  const showDetail = detail && !property.location.toLowerCase().includes(detail.toLowerCase())
  const tierMeta =
    property.listingTier === "premium"
      ? { label: t("topListing"), title: "Highest-visibility paid placement" }
      : property.listingTier === "featured"
      ? { label: t("promoted"), title: "Paid placement" }
      : null

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[20px] bg-loc-sand", imageClassName)}>
        <Image
          src={image}
          alt={`${property.title} in ${property.location}`}
          fill
          className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.06]"
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" aria-hidden="true" />
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
          <span className="glass-light text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full">
            {typeLabel}
          </span>
          {tierMeta && (
            <span
              className="glass-dark text-[11px] font-medium px-3 py-1.5 rounded-full"
              title={tierMeta.title}
            >
              {tierMeta.label}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 flex flex-col flex-1">
        <p className="flex items-center gap-1.5 text-loc-stone text-[13px]">
          <MapPin size={13} className="text-loc-terracotta shrink-0" aria-hidden="true" />
          <span className="truncate">
            {property.location}
            {property.country && !property.location.includes(property.country) ? `, ${property.country}` : ""}
          </span>
        </p>
        <h3 className="mt-1.5 font-heading font-semibold text-loc-night text-lg leading-snug line-clamp-2">
          <Link
            href={`/stays/${property.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:rounded-[20px] focus-visible:after:ring-2 focus-visible:after:ring-loc-terracotta focus-visible:after:ring-offset-4"
          >
            {name}
          </Link>
        </h3>
        {showDetail && <p className="mt-0.5 text-[14px] text-loc-stone line-clamp-1">{detail}</p>}
        <p className="mt-2 text-[15px] text-loc-night">
          <span className="text-loc-stone">{t("from")} </span>
          <span className="font-semibold tabular-nums">
            <PriceDisplay
              min={property.priceMin}
              max={property.priceMax}
              minOnly
              currency={property.currency}
              suffix={t("perNight")}
              priceContext={priceContext}
              className="inline"
            />
          </span>
        </p>
      </div>
    </article>
  )
}
