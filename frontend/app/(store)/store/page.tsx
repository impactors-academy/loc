import { ProductGrid } from "@/components/features/store/ProductGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Store" }

export default function StorePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader title="Digital Products" subtitle="Travel guides, maps, and resources for your Morocco journey" />
      <ProductGrid />
    </div>
  )
}
