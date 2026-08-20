"use client"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { HeroSearchBar } from "./HeroSearchBar"
import { HeroVideo } from "./HeroVideo"
import { TypewriterTitle } from "./TypewriterTitle"
import { useTranslations } from "next-intl"

const PILL_KEYS = [
  { key: "adventures", href: "/experiences?category=adventure" },
  { key: "wellness", href: "/experiences?category=wellness" },
  { key: "cultural", href: "/experiences?category=culture" },
  { key: "staysPill", href: "/stays" },
  { key: "guides", href: "/store" },
] as const

interface HeroSectionProps {
  title?: string
  animated?: boolean
  showSearch?: boolean
  subtitle: string
  ctaLabel: string
  ctaHref: string
  ctaSecondaryLabel?: string
  ctaSecondaryHref?: string
  videoUrl?: string
  imageUrl?: string
}

export function HeroSection({
  title,
  animated = false,
  showSearch = false,
  subtitle,
  ctaLabel,
  ctaHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  videoUrl,
  imageUrl,
}: HeroSectionProps) {
  const hasBg = videoUrl || imageUrl
  const t = useTranslations("hero")

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic video background. falls back to the poster as a static
          backdrop when the visitor has asked for reduced motion. */}
      {videoUrl && <HeroVideo videoUrl={videoUrl} posterUrl={imageUrl} />}

      {/* Static image fallback (shown when no video, or as poster while video loads) */}
      {!videoUrl && imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Overlay. dark gradient on media, brand gradient as full fallback */}
      <div
        className={cn(
          "absolute inset-0",
          hasBg
            ? "bg-gradient-to-b from-black/20 via-black/40 to-black/80"
            : "bg-gradient-to-br from-loc-night via-loc-slate to-loc-terracotta"
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-10">
        {/* Eyebrow */}
        <p className="font-sans text-loc-amber uppercase tracking-[0.25em] text-[10px] font-semibold mb-5">
          {t("eyebrow")}
        </p>

        {/* H1 */}
        {animated ? (
          <TypewriterTitle />
        ) : (
          <h1
            className="font-heading font-semibold tracking-tight text-balance leading-[0.92] mb-6"
            style={{ fontSize: 'var(--loc-text-hero)' }}
          >
            {title}
          </h1>
        )}

        {/* Subtitle */}
        <p className="font-sans text-base md:text-lg text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Search bar */}
        {showSearch && <HeroSearchBar />}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-loc-terracotta text-white font-semibold text-xs uppercase tracking-[0.04em] hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-lg shadow-black/20"
          >
            {ctaLabel}
          </Link>
          {ctaSecondaryLabel && ctaSecondaryHref && (
            <Link
              href={ctaSecondaryHref}
              className="inline-flex items-center px-8 py-3.5 rounded-full border border-white/50 text-white font-semibold text-xs uppercase tracking-[0.04em] hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              {ctaSecondaryLabel}
            </Link>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PILL_KEYS.map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
            >
              {t(pill.key)}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/25 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
