import { ProductGrid } from "@/components/features/store/ProductGrid"
import { PageHeader } from "@/components/shared/PageHeader"
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
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container mx-auto px-4 pb-24 md:pb-32">
        <div className="border-t border-loc-night/10 pt-10">
          <ProductGrid />
        </div>
      </div>
    </>
  )
}
