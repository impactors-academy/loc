"use client"

import { formatAmount } from "@/lib/types"
import type { Experience } from "@/lib/types"
import { Link } from "@/i18n/navigation"
import { getPoolImage } from "@/lib/images"
import { splitTitle, tidyDashes } from "@/lib/text"
import { cn } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Props {
  experience: Experience
  className?: string
  imageClassName?: string
  sizes?: string
  size?: "md" | "lg"
}

export function ExperienceCard({ experience, className, imageClassName, sizes, size = "md" }: Props) {
  const t = useTranslations("common")
  const tc = useTranslations("experienceCategories")
  const image = experience.images?.[0] ?? getPoolImage(experience.category, experience.slug)
  const { name, detail } = splitTitle(experience.title)
  const showDetail = detail && !experience.location.toLowerCase().includes(detail.toLowerCase())
  const categoryLabel = tc.has(experience.category) ? tc(experience.category) : experience.category
  const price = experience.priceMin != null ? `${formatAmount(experience.priceMin, experience.currency)} ${t("perPerson")}` : null

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[20px] bg-loc-sand", imageClassName)}>
        <Image
          src={image}
          alt={`${experience.title} in ${experience.location}`}
          fill
          className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.06]"
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" aria-hidden="true" />
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
          <span className="glass-light text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full">
            {categoryLabel}
          </span>
          {experience.isFeatured && (
            <span className="glass-dark text-[11px] font-medium px-3 py-1.5 rounded-full" title="Editor's selection">
              {t("topPick")}
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 flex flex-col flex-1">
        <p className="flex items-center gap-3 text-loc-stone text-[13px]">
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} className="text-loc-terracotta shrink-0" aria-hidden="true" />
            <span className="truncate">{experience.location}</span>
          </span>
          {experience.duration && (
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock size={13} className="text-loc-terracotta" aria-hidden="true" />
              {experience.duration}
            </span>
          )}
        </p>
        <h3
          className={cn(
            "mt-1.5 font-heading font-semibold text-loc-night leading-snug line-clamp-2",
            size === "lg" ? "text-2xl md:text-3xl tracking-tight leading-[1.1]" : "text-lg"
          )}
        >
          <Link
            href={`/experiences/${experience.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:rounded-[20px] focus-visible:after:ring-2 focus-visible:after:ring-loc-terracotta focus-visible:after:ring-offset-4"
          >
            {name}
          </Link>
        </h3>
        {showDetail && <p className="mt-0.5 text-[14px] text-loc-stone line-clamp-1">{detail}</p>}
        {size === "lg" && experience.description && (
          <p className="mt-2 text-loc-stone text-[15px] leading-relaxed line-clamp-2 max-w-xl">{tidyDashes(experience.description)}</p>
        )}
        {price && (
          <p className="mt-2 text-[15px] text-loc-night">
            <span className="text-loc-stone">{t("from")} </span>
            <span className="font-semibold tabular-nums">{price}</span>
          </p>
        )}
      </div>
    </article>
  )
}
