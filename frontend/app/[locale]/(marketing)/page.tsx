import { PropertyCard } from "@/components/features/stays/PropertyCard"
import { CommissionStat } from "@/components/shared/CommissionStat"
import { HeroSection } from "@/components/shared/HeroSection"
import { IntentSplit } from "@/components/shared/IntentSplit"
import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { api } from "@/lib/api"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

const TIER_RANK: Record<string, number> = { premium: 0, featured: 1, standard: 2 }

interface HowItWorksStep {
  title: string
  desc: string
}

export default async function HomePage() {
  const t = await getTranslations()
  const priceContext = await getVisitorPriceContext()
  const properties = await api.properties.list().catch(() => [])
  const featuredProperties = [...properties]
    .sort((a, b) => (TIER_RANK[a.listingTier] ?? 9) - (TIER_RANK[b.listingTier] ?? 9))
    .slice(0, 6)
  const howItWorksSteps = t.raw("howItWorks.steps") as HowItWorksStep[]

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

      {/* ── Trust stats ─────────────────────────────────────────────────── */}
      {/* Real, verifiable numbers only: one static product fact (no booking
          commission, ever). No stay/property count, no "Countries" or
          "Experiences" stat here — nothing else to honestly count yet. */}
      <section className="bg-loc-sand py-12" aria-label={t("homepage.statsLabel")}>
        <div className="container mx-auto px-4">
          <CommissionStat />
        </div>
      </section>

      {/* ── Intent split ────────────────────────────────────────────────── */}
      <IntentSplit />

      {/* ── How LOC Works ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader
              eyebrow={t("howItWorks.eyebrow")}
              title={t("howItWorks.title")}
              subtitle={t("howItWorks.subtitle")}
              center
            />
          </ScrollReveal>
          <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
            {howItWorksSteps.map((step, i) => (
              <ScrollRevealItem key={step.title}>
                <div className="text-center">
                  <span className="font-heading text-6xl font-semibold text-loc-sand select-none block mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-xl font-semibold text-loc-night mb-3">{step.title}</h3>
                  <p className="font-sans text-loc-stone text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── Handpicked Stays ────────────────────────────────────────────── */}
      {featuredProperties.length > 0 && (
      <section className="bg-loc-sand/30 py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
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
          </ScrollReveal>
          <ScrollReveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <ScrollRevealItem key={prop.id}>
                <PropertyCard property={prop} priceContext={priceContext} />
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
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
        <ScrollReveal className="container mx-auto px-4 text-center max-w-2xl">
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
        </ScrollReveal>
      </section>
    </>
  )
}
