import { PropertyFilters } from "@/components/features/stays/PropertyFilters"
import { PropertyGrid } from "@/components/features/stays/PropertyGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Stays Around the World | LOC",
  description:
    "Browse handpicked ryokans, riads, villas, gîtes, and apartments around the world — with direct contact, no hidden fees.",
}

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function StaysPage({ searchParams }: Props) {
  const { type } = await searchParams

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Places to Stay"
            title="Stays"
            subtitle="Ryokans, riads, villas, gîtes, and apartments — each one selected for its character, comfort, and location."
          />
        </div>
        <Suspense fallback={<div className="h-10" />}>
          <PropertyFilters />
        </Suspense>
        <PropertyGrid type={type} />
      </div>
    </main>
  )
}
