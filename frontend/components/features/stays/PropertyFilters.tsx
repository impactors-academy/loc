"use client"

import { COUNTRIES, PROPERTY_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export function PropertyFilters() {
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
    startTransition(() => router.push(`/stays?${params.toString()}`))
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Type pills */}
      <div className="flex flex-wrap gap-2">
        {PROPERTY_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => push({ type: t.value })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeType === t.value
                ? "bg-loc-terracotta text-white border-loc-terracotta"
                : "border-border text-loc-stone hover:border-loc-terracotta hover:text-loc-terracotta"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Country pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => push({ country: "" })}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
            activeCountry === ""
              ? "bg-loc-teal text-white border-loc-teal"
              : "border-border text-loc-stone hover:border-loc-teal hover:text-loc-teal"
          )}
        >
          All countries
        </button>
        {COUNTRIES.map((c) => (
          <button
            key={c.value}
            onClick={() => push({ country: c.value })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeCountry === c.value
                ? "bg-loc-teal text-white border-loc-teal"
                : "border-border text-loc-stone hover:border-loc-teal hover:text-loc-teal"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
