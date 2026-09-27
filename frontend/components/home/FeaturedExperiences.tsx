import { ExperienceCard } from "@/components/features/experiences/ExperienceCard"
import { ButtonLink } from "@/components/shared/ButtonLink"
import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Experience } from "@/lib/types"
import { getTranslations } from "next-intl/server"

export async function FeaturedExperiences({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null
  const t = await getTranslations("home")
  const picks = [...experiences].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)).slice(0, 5)
  const [lead, ...rest] = picks

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={t("experiencesEyebrow")}
            title={t("experiencesTitle")}
            subtitle={t("experiencesSubtitle")}
            className="mb-12"
          />
          <ButtonLink href="/experiences" variant="outline" arrow className="mb-12">
            {t("experiencesSeeAll")}
          </ButtonLink>
        </ScrollReveal>

        {/* Editorial layout: one lead story, the rest in a tighter grid. */}
        <ScrollReveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
          <ScrollRevealItem className="sm:col-span-2 lg:row-span-2">
            <ExperienceCard
              experience={lead}
              size="lg"
              imageClassName="aspect-[4/5] lg:aspect-auto lg:h-[calc(100%-10rem)] lg:min-h-[560px]"
              className="h-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </ScrollRevealItem>
          {rest.map((exp) => (
            <ScrollRevealItem key={exp.id}>
              <ExperienceCard experience={exp} imageClassName="aspect-[4/3]" />
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
