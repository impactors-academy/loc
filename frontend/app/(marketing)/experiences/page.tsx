import { ExperienceFilters } from "@/components/features/experiences/ExperienceFilters"
import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Experiences in Morocco | LOC",
  description:
    "Discover curated adventures, wellness retreats, cultural tours, and aerial experiences across Morocco — handpicked by locals.",
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function ExperiencesPage({ searchParams }: Props) {
  const { category } = await searchParams

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Explore Morocco"
            title="Experiences"
            subtitle="Adventures, wellness retreats, cultural tours, and more — curated by people who know Morocco best."
          />
        </div>
        <Suspense fallback={<div className="h-10" />}>
          <ExperienceFilters />
        </Suspense>
        <ExperienceGrid category={category} />
      </div>
    </main>
  )
}
