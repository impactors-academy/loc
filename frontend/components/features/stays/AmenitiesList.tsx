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
    <div className="border-t border-border pt-6 mb-8">
      <h2 className="font-heading text-lg font-semibold text-loc-night mb-4">{t("amenitiesTitle")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {amenities.map((value) => {
          const Icon = AMENITY_ICONS[value] ?? Sparkles
          return (
            <div key={value} className="flex items-center gap-2.5 text-sm text-loc-stone">
              <Icon className="w-4 h-4 text-loc-terracotta shrink-0" />
              <span>{LABELS[value] ?? value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
