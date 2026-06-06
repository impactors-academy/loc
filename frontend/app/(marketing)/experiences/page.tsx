import { ExperienceFilters } from "@/components/features/experiences/ExperienceFilters"
import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Experiences" }

export default function ExperiencesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader title="Tourism Experiences" subtitle="Browse and book unforgettable activities in Morocco" />
      <ExperienceFilters />
      <ExperienceGrid />
    </div>
  )
}
