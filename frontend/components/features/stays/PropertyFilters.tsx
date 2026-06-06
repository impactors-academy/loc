"use client"

import { PROPERTY_TYPES } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("type") ?? ""

  const setType = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set("type", value)
    else params.delete("type")
    router.push(`/stays?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {PROPERTY_TYPES.map((t) => (
        <button
          key={t.value}
          onClick={() => setType(t.value)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
            active === t.value ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
