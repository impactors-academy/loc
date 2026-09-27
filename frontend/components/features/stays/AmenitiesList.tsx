"use client"

import { PROPERTY_AMENITIES } from "@/lib/constants"
import { AMENITY_ICONS } from "./amenity-icons"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

const LABELS = Object.fromEntries(PROPERTY_AMENITIES.map((a) => [a.value, a.label]))

export function AmenitiesList({ amenities }: { amenities: string[] }) {
  const t = useTranslations("stayDetailPage")
  if (amenities.length === 0) return null

  return (
    <section className="py-10 border-b border-loc-night/10">
      <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-loc-night mb-6">{t("amenitiesTitle")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
        {amenities.map((value) => {
          const Icon = AMENITY_ICONS[value] ?? Sparkles
          return (
            <div key={value} className="flex items-center gap-3 text-[15px] text-loc-night/85">
              <Icon className="w-5 h-5 text-loc-terracotta shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>{LABELS[value] ?? value}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
