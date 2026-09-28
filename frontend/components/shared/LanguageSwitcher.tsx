"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
]

export function LanguageSwitcher({ scrolled = false }: { scrolled?: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
    setOpen(false)
  }

  const current = LOCALES.find((l) => l.code === locale)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 h-11 px-4 text-xs font-semibold rounded-full",
          scrolled ? "glass-light" : "glass-dark"
        )}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Globe size={14} />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <div className="glass-light absolute right-0 top-full mt-2 rounded-2xl p-1.5 min-w-[160px] z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={cn(
                "w-full text-left px-3.5 py-2 text-sm rounded-xl transition-colors",
                l.code === locale
                  ? "text-loc-terracotta font-medium bg-loc-sand/30"
                  : "text-loc-stone hover:text-loc-night hover:bg-loc-sand/20"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
