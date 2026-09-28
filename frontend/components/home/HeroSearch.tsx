"use client"

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useRouter } from "@/i18n/navigation"
import { COUNTRIES, PROPERTY_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { ChevronDown, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useId, useState } from "react"

type Tab = "experiences" | "stays"

const HOLD_MS = 2400

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex-1 min-w-0 rounded-full px-6 py-3 transition-colors hover:bg-loc-night/[0.04] focus-within:bg-loc-night/[0.04]",
        className
      )}
    >
      <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-loc-night">
        {label}
      </label>
      {children}
    </div>
  )
}

function SelectInput({ id, value, onChange, children }: {
  id: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent pr-6 text-[15px] text-loc-stone outline-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-loc-stone" aria-hidden="true" />
    </div>
  )
}

interface Props {
  hasExperiences: boolean
  stayCountries: string[]
  stayTypes: string[]
}

export function HeroSearch({ hasExperiences, stayCountries, stayTypes }: Props) {
  const [tab, setTab] = useState<Tab>(hasExperiences ? "experiences" : "stays")
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState("")
  const [type, setType] = useState("")
  const [suggIdx, setSuggIdx] = useState(0)
  const router = useRouter()
  const t = useTranslations("home.search")
  const th = useTranslations("hero")
  const tc = useTranslations("countries")
  const tp = useTranslations("propertyTypes")
  const tCommon = useTranslations("common")
  const suggestions = th.raw("searchSuggestions") as string[]
  const reduced = usePrefersReducedMotion()
  const uid = useId()

  useEffect(() => {
    if (reduced || query) return
    const timer = setInterval(() => setSuggIdx((i) => (i + 1) % suggestions.length), HOLD_MS)
    return () => clearInterval(timer)
  }, [reduced, query, suggestions.length])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (country) params.set("country", country)
    if (tab === "experiences") {
      if (query.trim()) params.set("q", query.trim())
    } else if (type) {
      params.set("type", type)
    }
    const qs = params.toString()
    router.push(`/${tab}${qs ? `?${qs}` : ""}`)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "experiences", label: t("tabExperiences") },
    { key: "stays", label: t("tabStays") },
  ]

  const countryField = (
    <Field id={`${uid}-country`} label={t("whereLabel")}>
      <SelectInput id={`${uid}-country`} value={country} onChange={setCountry}>
        <option value="">{t("anywhere")}</option>
        {COUNTRIES.map((c) => {
          // Only countries with live listings are selectable for stays; the
          // rest are listed as coming soon rather than leading to an empty page.
          const live = tab === "experiences" || stayCountries.includes(c.value)
          return (
            <option key={c.value} value={c.value} disabled={!live}>
              {live ? tc(c.value) : `${tc(c.value)} (${tCommon("comingSoon")})`}
            </option>
          )
        })}
      </SelectInput>
    </Field>
  )

  return (
    <div className="w-full max-w-3xl">
      <div className="glass-dark inline-flex gap-1 mb-3 rounded-full p-1" role="tablist" aria-label={t("tabsLabel")}>
        {tabs.map(({ key, label }) => {
          const soon = key === "experiences" && !hasExperiences
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${uid}-tab-${key}`}
              aria-selected={tab === key}
              aria-disabled={soon || undefined}
              aria-controls={`${uid}-panel`}
              onClick={() => !soon && setTab(key)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                tab === key ? "bg-white text-loc-night shadow-sm" : "text-white/80 hover:text-white",
                soon && "cursor-default text-white/55 hover:text-white/55"
              )}
            >
              {label}
              {soon && (
                <span className="rounded-full bg-loc-amber/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-loc-night">
                  {tCommon("soon")}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <form
        id={`${uid}-panel`}
        role="search"
        aria-labelledby={`${uid}-tab-${tab}`}
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row md:items-center gap-1 bg-white rounded-[28px] md:rounded-full p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        {tab === "experiences" ? (
          <>
            <Field id={`${uid}-q`} label={t("whatLabel")} className="md:flex-[1.4]">
              <div className="relative">
                <input
                  id={`${uid}-q`}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={reduced ? suggestions[0] : ""}
                  autoComplete="off"
                  className="w-full bg-transparent text-[15px] text-loc-night placeholder:text-loc-stone outline-none"
                />
                {!query && !reduced && (
                  <span className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" aria-hidden="true">
                    <span key={suggIdx} className="block text-[15px] text-loc-stone animate-[suggest_450ms_var(--loc-ease-expo)_both]">
                      {suggestions[suggIdx]}
                    </span>
                  </span>
                )}
              </div>
            </Field>
            <span className="hidden md:block h-8 w-px bg-loc-night/10" aria-hidden="true" />
            {countryField}
          </>
        ) : (
          <>
            {countryField}
            <span className="hidden md:block h-8 w-px bg-loc-night/10" aria-hidden="true" />
            <Field id={`${uid}-type`} label={t("typeLabel")}>
              <SelectInput id={`${uid}-type`} value={type} onChange={setType}>
                <option value="">{t("anyType")}</option>
                {PROPERTY_TYPES.filter((p) => stayTypes.includes(p.value)).map((p) => (
                  <option key={p.value} value={p.value}>{tp(p.value)}</option>
                ))}
              </SelectInput>
            </Field>
          </>
        )}
        <button
          type="submit"
          className="btn-primary group shrink-0 inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full font-semibold text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-copper focus-visible:ring-offset-2"
        >
          <Search size={18} aria-hidden="true" />
          <span>{t("submit")}</span>
        </button>
      </form>
    </div>
  )
}
