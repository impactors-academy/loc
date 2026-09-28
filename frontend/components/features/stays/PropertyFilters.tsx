"use client"

import { FilterChip, Segmented } from "@/components/shared/FilterChip"
import { useRouter } from "@/i18n/navigation"
import { COUNTRIES, PROPERTY_TYPES } from "@/lib/constants"
import { Building2, DoorOpen, Hotel, House, LayoutGrid, Tent, TreePine, type LucideIcon } from "lucide-react"
import { useProperties } from "@/hooks/useProperties"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useTransition } from "react"

const TYPE_ICONS: Record<string, LucideIcon> = {
  "": LayoutGrid,
  apartment: Building2,
  villa: House,
  gite: TreePine,
  riad: DoorOpen,
  hotel: Hotel,
  bivouac: Tent,
}

export function PropertyFilters() {
  const tp = useTranslations("propertyTypes")
  const tc = useTranslations("countries")
  const tCommon = useTranslations("common")
  // The unfiltered list (shared react-query cache with the grid) tells us which
  // types and countries actually have stays, so no filter leads to nothing.
  const { data: all = [] } = useProperties()
  const liveTypes = new Set<string>(all.map((p) => p.type))
  const liveCountries = new Set<string | undefined>(all.map((p) => p.country))
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeType = searchParams.get("type") ?? ""
  const activeCountry = searchParams.get("country") ?? ""
  const [, startTransition] = useTransition()

  const push = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    const qs = params.toString()
    startTransition(() => router.push(`/stays${qs ? `?${qs}` : ""}`, { scroll: false }))
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-4 lg:justify-between">
      <div
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap"
        role="group"
        aria-label={tp("filterLabel")}
      >
        {PROPERTY_TYPES.filter((type) => !type.value || liveTypes.has(type.value) || activeType === type.value).map((type) => (
          <FilterChip
            key={type.value}
            active={activeType === type.value}
            onClick={() => push({ type: type.value })}
            icon={TYPE_ICONS[type.value]}
          >
            {tp(type.value || "all")}
          </FilterChip>
        ))}
      </div>
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 shrink-0">
        <Segmented
          label={tc("filterLabel")}
          value={activeCountry}
          onChange={(v) => push({ country: v })}
          options={[
            { value: "", label: tc("all") },
            ...COUNTRIES.map((c) => ({
              value: c.value,
              label: tc(c.value),
              soon: all.length > 0 && !liveCountries.has(c.value) ? tCommon("soon") : undefined,
            })),
          ]}
        />
      </div>
    </div>
  )
}
