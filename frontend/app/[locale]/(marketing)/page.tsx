import { PropertyCard } from "@/components/features/stays/PropertyCard"
import { CategoryRail } from "@/components/home/CategoryRail"
import { Destinations } from "@/components/home/Destinations"
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences"
import { HomeHero } from "@/components/home/HomeHero"
import { HowItWorks } from "@/components/home/HowItWorks"
import { JournalPreview } from "@/components/home/JournalPreview"
import { PartnerCta } from "@/components/home/PartnerCta"
import { Rail } from "@/components/home/Rail"
import { ZeroCommission } from "@/components/home/ZeroCommission"
import { ButtonLink } from "@/components/shared/ButtonLink"
import { FaqSection, type FaqItem } from "@/components/shared/FaqSection"
import { Marquee } from "@/components/shared/Marquee"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { api } from "@/lib/api"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import { getTranslations } from "next-intl/server"

const TIER_RANK: Record<string, number> = { premium: 0, featured: 1, standard: 2 }

export default async function HomePage() {
  const t = await getTranslations()
  const [priceContext, properties, experiences, posts] = await Promise.all([
    getVisitorPriceContext(),
    api.properties.list().catch(() => []),
    api.experiences.list().catch(() => []),
    api.blog.list().catch(() => []),
  ])

  // Everything the hero offers is derived from live listings, so it can never
  // point a visitor at a destination or type that has nothing in it.
  const cityCounts = new Map<string, number>()
  for (const p of properties) {
    const city = p.location.split(",").pop()?.trim()
    if (city) cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1)
  }
  const cities = [...cityCounts.entries()].sort((a, b) => b[1] - a[1]).map(([city]) => city)
  const stayCountries = [...new Set(properties.map((p) => p.country).filter((c): c is string => Boolean(c)))]
  const stayTypes = [...new Set(properties.map((p) => p.type))]
  // Cities come from the data; the countries after them are translated with
  // their preposition ("en Belgique", "na Bélgica"), which a raw country name
  // can't provide. All three markets are named even before each has listings.
  const cityNames = t.raw("hero.cityNames") as Record<string, string>
  const heroWords = [
    ...cities.map((city) => t("hero.city", { city: cityNames[city] ?? city })),
    ...(t.raw("hero.destinations") as string[]),
  ]
  const categoryCounts = Object.fromEntries(
    [...new Set(experiences.map((e) => e.category))].map((cat) => [cat, experiences.filter((e) => e.category === cat).length])
  )

  const featuredProperties = [...properties]
    .sort((a, b) => (TIER_RANK[a.listingTier] ?? 9) - (TIER_RANK[b.listingTier] ?? 9))
    .slice(0, 8)

  return (
    <>
      <HomeHero
        words={heroWords}
        hasExperiences={experiences.length > 0}
        stayCountries={stayCountries}
        stayTypes={stayTypes}
      />

      <div className="bg-loc-night border-t border-white/10 py-6 md:py-8 font-heading text-2xl md:text-4xl font-semibold tracking-tight text-white">
        <Marquee items={t.raw("home.marquee") as string[]} />
      </div>

      {featuredProperties.length > 0 && (
        <section className="bg-white py-24 md:py-32">
          <Rail
            prevLabel={t("home.previous")}
            nextLabel={t("home.next")}
            header={
              <div id="stays-rail-title">
                <SectionHeader
                  eyebrow={t("handpickedStays.eyebrow")}
                  title={t("handpickedStays.title")}
                  subtitle={t("handpickedStays.subtitle")}
                />
              </div>
            }
          >
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                priceContext={priceContext}
                className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[calc(25%-15px)]"
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw"
              />
            ))}
          </Rail>
          <div className="container mx-auto px-4 mt-12">
            <ButtonLink href="/stays" variant="outline" arrow>
              {t("handpickedStays.seeAll")}
            </ButtonLink>
          </div>
        </section>
      )}

      <Destinations properties={properties} experiences={experiences} />
      <CategoryRail counts={categoryCounts} />
      <ZeroCommission />
      <FeaturedExperiences experiences={experiences} />
      <HowItWorks />
      <JournalPreview posts={posts} />
      <FaqSection
        eyebrow={t("homeFaq.eyebrow")}
        title={t("homeFaq.title")}
        subtitle={t("homeFaq.subtitle")}
        items={t.raw("homeFaq.items") as FaqItem[]}
        className="bg-white"
      />
      <PartnerCta />
    </>
  )
}
