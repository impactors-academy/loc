import { ProductGrid } from "@/components/features/store/ProductGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Morocco Travel Guides & Digital Products | LOC",
  description:
    "Download curated Morocco travel guides, experience maps, relocation guides, and photography packs — crafted by people who live here.",
  alternates: { canonical: "/store" },
}

export default function StorePage() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow="Digital Products"
            title="Travel smarter with LOC"
            subtitle="Guides, maps, and resource packs for your Morocco journey — downloadable instantly."
          />
        </div>
        <ProductGrid />
      </div>
    </main>
  )
}
