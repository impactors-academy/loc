import { PropertyCard } from "@/components/features/stays/PropertyCard"
import { FeaturedCitiesSlideshow } from "@/components/features/home/FeaturedCitiesSlideshow"
import { HeroSection } from "@/components/shared/HeroSection"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { api } from "@/lib/api"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import {
  CATEGORIES,
  COMMISSION_STAT,
  FEATURED_CITIES,
  HOW_IT_WORKS,
} from "./_data"

const TIER_RANK: Record<string, number> = { premium: 0, featured: 1, standard: 2 }

export default async function HomePage() {
  const t = await getTranslations()
  const priceContext = await getVisitorPriceContext()
  const properties = await api.properties.list().catch(() => [])
  const featuredProperties = [...properties]
    .sort((a, b) => (TIER_RANK[a.listingTier] ?? 9) - (TIER_RANK[b.listingTier] ?? 9))
    .slice(0, 6)

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <HeroSection
        animated
        showSearch
        subtitle={t("hero.subtitle")}
        ctaLabel={t("hero.cta")}
        ctaHref="/experiences"
        ctaSecondaryLabel={t("hero.ctaSecondary")}
        ctaSecondaryHref="/stays"
        videoUrl="/videos/sahara_hero_horizontal.mp4"
        imageUrl="/images/hero.jpg"
      />

      {/* ── Featured Cities ──────────────────────────────────────────────── */}
      <section className="bg-loc-cream py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow={t("featuredCities.eyebrow")}
            title={t("featuredCities.title")}
            subtitle={t("featuredCities.subtitle")}
          />
          <div className="mt-10">
            <FeaturedCitiesSlideshow cities={FEATURED_CITIES} comingSoonLabel={t("featuredCities.comingSoon")} />
          </div>
        </div>
      </section>

      {/* ── Trust stats ─────────────────────────────────────────────────── */}
      {/* Real, verifiable numbers only: live stay count and operating-country
          count both come from the same data the sections above render, plus
          one static product fact (no booking commission, ever). */}
      <section className="bg-loc-sand py-10" aria-label="Platform statistics">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-heading text-3xl font-semibold text-loc-terracotta">{properties.length}</p>
              <p className="font-sans text-sm text-loc-stone mt-1">Handpicked Stays</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold text-loc-terracotta">{FEATURED_CITIES.length}</p>
              <p className="font-sans text-sm text-loc-stone mt-1">Countries</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold text-loc-terracotta">{COMMISSION_STAT.value}</p>
              <p className="font-sans text-sm text-loc-stone mt-1">{COMMISSION_STAT.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category grid ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow={t("categories.eyebrow")}
            title={t("categories.title")}
            subtitle={t("categories.subtitle")}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end p-5 hover:scale-[1.02] transition-transform duration-300 shadow-md"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
                <div
                  className={`absolute inset-0 ${
                    cat.imageUrl
                      ? "bg-gradient-to-b from-black/10 via-black/20 to-black/75"
                      : `bg-gradient-to-b ${cat.gradient}`
                  }`}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  {!cat.imageUrl && (
                    <span className="text-4xl mb-3 block select-none">{cat.icon}</span>
                  )}
                  <h3 className="font-heading text-white text-lg font-semibold leading-tight">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-white/70 text-xs mt-1">{cat.subtitle}</p>
                </div>
                <span
                  className="absolute top-4 right-4 text-white/30 group-hover:text-white/70 transition-colors text-xl z-10"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How LOC Works ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow={t("howItWorks.eyebrow")}
            title={t("howItWorks.title")}
            subtitle={t("howItWorks.subtitle")}
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <span className="font-heading text-6xl font-semibold text-loc-sand select-none block mb-2">
                  {step.step}
                </span>
                <h3 className="font-heading text-xl font-semibold text-loc-night mb-3">{step.title}</h3>
                <p className="font-sans text-loc-stone text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Handpicked Stays ────────────────────────────────────────────── */}
      {featuredProperties.length > 0 && (
      <section className="bg-loc-sand/30 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <SectionHeader
              eyebrow={t("handpickedStays.eyebrow")}
              title={t("handpickedStays.title")}
              subtitle={t("handpickedStays.subtitle")}
            />
            <Link
              href="/stays"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta hover:text-loc-terracotta/80 transition-colors mb-10 shrink-0"
            >
              {t("handpickedStays.seeAll")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} priceContext={priceContext} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/stays"
              className="inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta"
            >
              {t("handpickedStays.seeAll")} →
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ── Partner CTA ─────────────────────────────────────────────────── */}
      <section className="bg-loc-night py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="font-sans text-loc-amber uppercase tracking-widest text-xs font-medium mb-4">
            {t("partnerCta.eyebrow")}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-white text-balance mb-5">
            {t("partnerCta.title")}
          </h2>
          <p className="font-sans text-neutral-400 text-lg leading-relaxed mb-10">
            {t("partnerCta.subtitle")}
          </p>
          <Link
            href="/promote"
            className="inline-flex items-center px-8 py-4 rounded-full bg-loc-terracotta text-white font-semibold hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-lg"
          >
            {t("partnerCta.cta")}
          </Link>
        </div>
      </section>
    </>
  )
}
