"use client"

import { SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/i18n/navigation"
import Image from "next/image"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { ButtonLink } from "./ButtonLink"
import { LanguageSwitcher } from "./LanguageSwitcher"

// Stays lead because they are the only live product (2026-09-27, Markie's
// call). The rest keep their Phase 1 monetization order; re-rank the whole
// menu once experiences, guides and partner packages launch (BUILD-CHECKLIST).
const NAV_KEYS = [
  { key: "stays", href: "/stays" },
  { key: "blog", href: "/blog" },
  { key: "store", href: "/store" },
  { key: "promote", href: "/promote" },
  { key: "experiences", href: "/experiences" },
] as const

const EASE = [0.19, 1, 0.22, 1] as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [menuPath, setMenuPath] = useState(pathname)
  const lastY = useRef(0)

  // Only the homepage opens on a full-bleed dark hero; every other page starts
  // on cream, so the bar is solid there from the first paint.
  const isHome = pathname === "/"
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Tuck the bar away while reading downwards, bring it back on any upward
      // scroll: the page gets the full height without the nav ever being lost.
      setHidden(y > 480 && y > lastY.current)
      lastY.current = y
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-expo",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        transparent
          ? "bg-transparent border-b border-transparent"
          : open
          ? "bg-loc-cream border-b border-loc-night/[0.06]"
          : "bg-loc-cream/85 backdrop-blur-xl backdrop-saturate-150 border-b border-loc-night/[0.06]"
      )}
    >
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" className="relative z-10 flex items-center gap-2.5 shrink-0" aria-label={`${SITE_NAME} home`}>
          <Image
            src="/icons/loc-mark.png"
            alt=""
            aria-hidden
            width={36}
            height={36}
            priority
            className="w-8 h-8 md:w-9 md:h-9 flex-none rounded-[3px]"
          />
          <span
            className={cn(
              "font-heading font-semibold text-2xl tracking-tight transition-colors duration-300",
              transparent ? "text-white" : "text-loc-night"
            )}
          >
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_KEYS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300",
                  transparent
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : active
                    ? "text-loc-night"
                    : "text-loc-stone hover:text-loc-night hover:bg-loc-night/[0.04]"
                )}
              >
                {t(link.key)}
                {active && (
                  <span
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 bottom-0.5 h-1 w-1 rounded-full",
                      transparent ? "bg-white" : "bg-loc-terracotta"
                    )}
                    aria-hidden="true"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher scrolled={!transparent} />
          <ButtonLink href="/promote" variant={transparent ? "ghost-light" : "primary"}>
            {t("listWithUs")}
          </ButtonLink>
        </div>

        <button
          type="button"
          className={cn(
            "lg:hidden relative z-10 -mr-2 h-11 w-11 inline-flex items-center justify-center rounded-full transition-colors",
            transparent ? "glass-dark" : "glass-light"
          )}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 bg-loc-cream overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-4 pt-6 pb-10 flex flex-col min-h-full" aria-label="Mobile navigation">
              <ul className="border-t border-loc-night/10">
                {NAV_KEYS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    className="border-b border-loc-night/10"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className="flex items-center justify-between py-5 font-heading text-4xl font-semibold tracking-tight text-loc-night"
                    >
                      {t(link.key)}
                      <ArrowUpRight size={24} className="text-loc-terracotta" aria-hidden="true" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pt-10 flex items-center justify-between gap-4">
                <LanguageSwitcher scrolled />
                <ButtonLink href="/promote" onClick={() => setOpen(false)} size="lg">
                  {t("listWithUs")}
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
