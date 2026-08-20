"use client"

import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const SUGGESTIONS = [
  "Kyoto tea ceremony",
  "Bali surf lesson",
  "Marrakech riad",
  "Santorini sunset sail",
  "Bordeaux wine tasting",
  "Tokyo street food",
  "Provence cycling tour",
  "Brussels chocolate workshop",
]

const HOLD_MS = 2400
const FADE_MS = 350

export function HeroSearchBar() {
  const [query, setQuery] = useState("")
  const [suggIdx, setSuggIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const router = useRouter()
  const t = useTranslations("common")
  const prefersReducedMotion = usePrefersReducedMotion()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (prefersReducedMotion || query) return

    timerRef.current = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setSuggIdx((i) => (i + 1) % SUGGESTIONS.length)
        setVisible(true)
      }, FADE_MS)
    }, HOLD_MS + FADE_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [prefersReducedMotion, query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/experiences?q=${encodeURIComponent(q)}`)
  }

  const showAnimatedPlaceholder = !query && !prefersReducedMotion

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
        <div className="relative flex-1 min-w-0">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={prefersReducedMotion ? SUGGESTIONS[0] : ""}
            className="w-full bg-transparent text-white placeholder:text-white/50 text-sm px-3 py-1.5 outline-none"
          />
          {showAnimatedPlaceholder && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none transition-all"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(-50%)"
                  : "translateY(calc(-50% - 4px))",
                transitionDuration: `${FADE_MS}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              aria-hidden="true"
            >
              {SUGGESTIONS[suggIdx]}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 bg-loc-terracotta hover:bg-loc-terracotta/90 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          {t("search")}
        </button>
      </div>
    </form>
  )
}
