import { PropertyFilters } from "@/components/features/stays/PropertyFilters"
import { PropertyGrid } from "@/components/features/stays/PropertyGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Stays" }

export default function StaysPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader title="Places to Stay" subtitle="Apartments, villas, and local stays in Morocco" />
      <PropertyFilters />
      <PropertyGrid />
    </div>
  )
}
