"use client"

import { COUNTRIES, EXPERIENCE_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useTransition } from "react"

export function ExperienceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") ?? ""
  const activeCountry = searchParams.get("country") ?? ""
  const activeQ = searchParams.get("q") ?? ""
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  const push = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => router.push(`/experiences?${params.toString()}`))
  }

  const handleSearch = (e: { preventDefault(): void }) => {
    e.preventDefault()
    push({ q: inputRef.current?.value ?? "" })
  }

  const clearSearch = () => {
    if (inputRef.current) inputRef.current.value = ""
    push({ q: "" })
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-loc-stone pointer-events-none" />
        <input
          ref={inputRef}
          defaultValue={activeQ}
          placeholder="Search experiences…"
          className="w-full pl-9 pr-9 py-2.5 rounded-full border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-loc-terracotta/30 focus:border-loc-terracotta transition-colors"
        />
        {activeQ && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-loc-stone hover:text-loc-night"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {EXPERIENCE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => push({ category: cat.value })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeCategory === cat.value
                ? "bg-loc-terracotta text-white border-loc-terracotta"
                : "border-border text-loc-stone hover:border-loc-terracotta hover:text-loc-terracotta"
            )}
          >
            {cat.label}
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
