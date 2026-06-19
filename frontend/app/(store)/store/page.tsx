import { ProductGrid } from "@/components/features/store/ProductGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Global Travel Guides & Digital Products | LOC",
  description:
    "Download curated travel guides, destination itineraries, and video courses for Japan, France, Morocco, Bali, and more — crafted by people who live there.",
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
            subtitle="Guides, itineraries, and video courses for destinations around the world — downloadable instantly."
          />
        </div>
        <ProductGrid />
      </div>
    </main>
  )
}
