import { ProductGrid } from "@/components/features/store/ProductGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("storePage")
  return {
    title: `${t("metaTitle")} | LOC`,
    description: t("metaDescription"),
    alternates: { canonical: "/store" },
  }
}

export default async function StorePage() {
  const t = await getTranslations("storePage")

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
        <ProductGrid />
      </div>
    </main>
  )
}
