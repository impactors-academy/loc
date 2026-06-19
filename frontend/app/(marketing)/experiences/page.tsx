import { ExperienceFilters } from "@/components/features/experiences/ExperienceFilters"
import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Experiences Around the World | LOC",
  description:
    "Discover curated adventures, wellness retreats, culinary tours, and cultural experiences across Japan, France, Morocco, Bali, and beyond — handpicked by locals.",
  alternates: { canonical: "/experiences" },
}

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function ExperiencesPage({ searchParams }: Props) {
  const { category, q } = await searchParams

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Explore the world"
            title="Experiences"
            subtitle="Adventures, wellness retreats, culinary tours, and more — curated by people who know each destination best."
          />
        </div>
        <Suspense fallback={<div className="h-16" />}>
          <ExperienceFilters />
        </Suspense>
        <ExperienceGrid category={category} q={q} />
      </div>
    </main>
  )
}
