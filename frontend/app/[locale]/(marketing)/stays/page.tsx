import { PropertyFilters } from "@/components/features/stays/PropertyFilters"
import { PropertyGrid } from "@/components/features/stays/PropertyGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { Suspense } from "react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("staysPage")
  return {
    title: `${t("metaTitle")} | LOC`,
    description: t("metaDescription"),
  }
}

interface Props {
  searchParams: Promise<{ type?: string; country?: string }>
}

export default async function StaysPage({ searchParams }: Props) {
  const { type, country } = await searchParams
  const priceContext = await getVisitorPriceContext()
  const t = await getTranslations("staysPage")

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
        <Suspense fallback={<div className="h-10" />}>
          <PropertyFilters />
        </Suspense>
        <PropertyGrid type={type} country={country} priceContext={priceContext} />
      </div>
    </main>
  )
}
