"use client"

import { EXPERIENCE_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

export function ExperienceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("category") ?? ""

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set("category", value)
    else params.delete("category")
    router.push(`/experiences?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {EXPERIENCE_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
            active === cat.value
              ? "bg-loc-terracotta text-white border-loc-terracotta"
              : "border-border text-loc-stone hover:border-loc-terracotta hover:text-loc-terracotta"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
