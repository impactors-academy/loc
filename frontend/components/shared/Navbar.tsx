"use client"

import { SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/i18n/navigation"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./LanguageSwitcher"

// Ordered to match Phase 1 monetization priority (Blog, Digital Products,
// Promote — see LOC Phase 1 Strategy Presentation), not by feature age.
const NAV_KEYS = [
  { key: "blog", href: "/blog" },
  { key: "store", href: "/store" },
  { key: "promote", href: "/promote" },
  { key: "experiences", href: "/experiences" },
  { key: "stays", href: "/stays" },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations("nav")
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)

  // Transparent hero state only applies on the homepage before scroll
  const isHome = pathname === "/"
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close mobile menu when clicking anywhere outside the header
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-white/96 backdrop-blur-md shadow-sm border-b border-loc-sand/70"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icons/loc-mark.png"
            alt=""
            aria-hidden
            width={36}
            height={36}
            priority
            className="w-8 h-8 md:w-9 md:h-9 flex-none"
          />
          <span
            className={cn(
              "font-heading font-semibold text-2xl tracking-tight transition-colors",
              transparent ? "text-white" : "text-loc-night"
            )}
          >
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-loc-stone hover:text-loc-terracotta"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher scrolled={!transparent} />
          <Link
            href="/promote"
            className={cn(
              "text-sm font-semibold px-5 py-2.5 rounded-full transition-all",
              transparent
                ? "bg-white/15 text-white border border-white/40 hover:bg-white/25 backdrop-blur-sm"
                : "bg-loc-terracotta text-white hover:bg-loc-terracotta/90"
            )}
          >
            {t("listWithUs")}
          </Link>
        </div>

        <button
          className={cn(
            "md:hidden p-2 rounded-md transition-colors",
            transparent ? "text-white" : "text-loc-night"
          )}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-loc-sand px-4 py-5 flex flex-col gap-3 shadow-lg">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-loc-night hover:text-loc-terracotta transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/promote"
            className="mt-3 text-center text-sm font-semibold px-5 py-3 rounded-full bg-loc-terracotta text-white hover:bg-loc-terracotta/90 transition-colors"
            onClick={() => setOpen(false)}
          >
            {t("listWithUs")}
          </Link>
          {/* Language switcher visible in mobile drawer */}
          <div className="mt-2 pt-3 border-t border-loc-sand/60">
            <LanguageSwitcher scrolled={true} />
          </div>
        </div>
      )}
    </header>
  )
}
