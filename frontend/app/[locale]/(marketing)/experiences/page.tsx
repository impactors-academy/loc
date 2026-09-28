import { ExperienceFilters } from "@/components/features/experiences/ExperienceFilters"
import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { PageHeader } from "@/components/shared/PageHeader"
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
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container mx-auto px-4 pb-24 md:pb-32">
        <div className="border-t border-loc-night/10 pt-8 mb-10">
          <Suspense fallback={<div className="h-32" />}>
            <ExperienceFilters />
          </Suspense>
        </div>
        <ExperienceGrid category={category} country={country} q={q} />
      </div>
    </>
  )
}
