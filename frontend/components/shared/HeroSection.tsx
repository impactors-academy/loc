import Link from "next/link"
import { cn } from "@/lib/utils"
import { HeroSearchBar } from "./HeroSearchBar"
import { TypewriterTitle } from "./TypewriterTitle"

const CATEGORY_PILLS = [
  { label: "Adventures", href: "/experiences?category=adventure" },
  { label: "Wellness", href: "/experiences?category=wellness" },
  { label: "Cultural", href: "/experiences?category=culture" },
  { label: "Stays", href: "/stays" },
  { label: "Guides", href: "/store" },
]

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

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic video background */}
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={imageUrl}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Static image fallback (shown when no video, or as poster while video loads) */}
      {!videoUrl && imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Overlay — dark gradient on media, brand gradient as full fallback */}
      <div
        className={cn(
          "absolute inset-0",
          hasBg
            ? "bg-gradient-to-b from-black/20 via-black/40 to-black/80"
            : "bg-gradient-to-br from-loc-night via-[#1a3d4a] to-loc-terracotta"
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto pt-10">
        {/* Eyebrow */}
        <p className="font-sans text-loc-amber uppercase tracking-[0.3em] text-xs font-medium mb-5">
          Global · Authentic · Curated
        </p>

        {/* H1 */}
        {animated ? (
          <TypewriterTitle />
        ) : (
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-balance leading-[1.05] mb-6">
            {title}
          </h1>
        )}

        {/* Subtitle */}
        <p className="font-sans text-lg md:text-xl text-white/75 mb-8 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* Search bar */}
        {showSearch && <HeroSearchBar />}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-loc-terracotta text-white font-semibold text-sm hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-lg shadow-black/20"
          >
            {ctaLabel}
          </Link>
          {ctaSecondaryLabel && ctaSecondaryHref && (
            <Link
              href={ctaSecondaryHref}
              className="inline-flex items-center px-8 py-3.5 rounded-full border border-white/50 text-white font-semibold text-sm hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              {ctaSecondaryLabel}
            </Link>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_PILLS.map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
            >
              {pill.label}
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
