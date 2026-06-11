"use client"

import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-loc-sand/70"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={cn(
            "font-heading font-bold text-2xl tracking-tight transition-colors",
            scrolled ? "text-loc-night" : "text-white"
          )}
        >
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                scrolled
                  ? "text-loc-stone hover:text-loc-terracotta"
                  : "text-white/85 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/promote"
            className={cn(
              "text-sm font-semibold px-5 py-2.5 rounded-full transition-all",
              scrolled
                ? "bg-loc-terracotta text-white hover:bg-loc-terracotta/90"
                : "bg-white/15 text-white border border-white/40 hover:bg-white/25 backdrop-blur-sm"
            )}
          >
            List with us
          </Link>
        </div>

        <button
          className={cn(
            "md:hidden p-2 rounded-md transition-colors",
            scrolled ? "text-loc-night" : "text-white"
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-loc-night hover:text-loc-terracotta transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/promote"
            className="mt-3 text-center text-sm font-semibold px-5 py-3 rounded-full bg-loc-terracotta text-white hover:bg-loc-terracotta/90 transition-colors"
            onClick={() => setOpen(false)}
          >
            List with us
          </Link>
        </div>
      )}
    </header>
  )
}
