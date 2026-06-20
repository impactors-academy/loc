"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function HeroSearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/experiences?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto mb-10"
      role="search"
      aria-label="Search experiences"
    >
      <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 focus-within:bg-white/15 focus-within:border-white/50 transition-all shadow-lg shadow-black/20">
        <Search
          size={18}
          className="ml-3 text-white/60 shrink-0"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search experiences — 'Kyoto tea ceremony', 'Bali surf'…"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 text-sm px-3 py-1.5 outline-none min-w-0"
        />
        <button
          type="submit"
          className="shrink-0 bg-loc-terracotta hover:bg-loc-terracotta/90 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}
