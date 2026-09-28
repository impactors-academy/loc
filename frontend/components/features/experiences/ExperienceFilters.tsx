"use client"

import { FilterChip, Segmented } from "@/components/shared/FilterChip"
import { useRouter } from "@/i18n/navigation"
import { COUNTRIES, EXPERIENCE_CATEGORIES } from "@/lib/constants"
import { Flower2, Landmark, LayoutGrid, Mountain, Search, UtensilsCrossed, Waves, Wind, X, type LucideIcon } from "lucide-react"
import { useExperiences } from "@/hooks/useExperiences"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useRef, useTransition } from "react"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "": LayoutGrid,
  adventure: Mountain,
  wellness: Flower2,
  culture: Landmark,
  culinary: UtensilsCrossed,
  water: Waves,
  aerial: Wind,
}

export function ExperienceFilters() {
  const t = useTranslations("experienceCategories")
  const tc = useTranslations("countries")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? ""
  const activeCountry = searchParams.get("country") ?? ""
  const activeQ = searchParams.get("q") ?? ""
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()
  const { data: all } = useExperiences()

  const push = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    const qs = params.toString()
    startTransition(() => router.push(`/experiences${qs ? `?${qs}` : ""}`, { scroll: false }))
  }

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault()
    push({ q: inputRef.current?.value.trim() ?? "" })
  }

  const clearSearch = () => {
    if (inputRef.current) inputRef.current.value = ""
    push({ q: "" })
  }

  // Nothing to filter until the first experiences are live; the grid below
  // shows the coming-soon panel instead.
  if (all && all.length === 0) return null

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <form onSubmit={handleSearch} role="search" aria-label={tCommon("search")} className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-loc-stone pointer-events-none" aria-hidden="true" />
          <input
            ref={inputRef}
            key={activeQ}
            type="search"
            defaultValue={activeQ}
            placeholder={t("searchPlaceholder")}
            aria-label={tCommon("search")}
            className="w-full h-14 pl-12 pr-12 rounded-full border border-loc-night/10 text-[15px] bg-white placeholder:text-loc-stone focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
          />
          {activeQ && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-loc-stone hover:bg-loc-night/5 hover:text-loc-night"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </form>
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <Segmented
            label={tc("filterLabel")}
            value={activeCountry}
            onChange={(v) => push({ country: v })}
            options={[{ value: "", label: tc("all") }, ...COUNTRIES.map((c) => ({ value: c.value, label: tc(c.value) }))]}
          />
        </div>
      </div>

      <div
        className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
        role="group"
        aria-label={t("filterLabel")}
      >
        {EXPERIENCE_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.value}
            active={activeCategory === cat.value}
            onClick={() => push({ category: cat.value })}
            icon={CATEGORY_ICONS[cat.value]}
          >
            {t(cat.value || "all")}
          </FilterChip>
        ))}
      </div>
    </div>
  )
}
