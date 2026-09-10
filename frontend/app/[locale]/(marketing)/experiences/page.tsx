import { ExperienceFilters } from "@/components/features/experiences/ExperienceFilters"
import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { Suspense } from "react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("experiencesPage")
  return {
    title: `${t("metaTitle")} | LOC`,
    description: t("metaDescription"),
    alternates: { canonical: "/experiences" },
  }
}

interface Props {
  searchParams: Promise<{ category?: string; country?: string; q?: string }>
}

export default async function ExperiencesPage({ searchParams }: Props) {
  const { category, country, q } = await searchParams
  const t = await getTranslations("experiencesPage")

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </div>
        <Suspense fallback={<div className="h-16" />}>
          <ExperienceFilters />
        </Suspense>
        <ExperienceGrid category={category} country={country} q={q} />
      </div>
    </main>
  )
}
