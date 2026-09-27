import { PropertyFilters } from "@/components/features/stays/PropertyFilters"
import { PropertyGrid } from "@/components/features/stays/PropertyGrid"
import { PageHeader } from "@/components/shared/PageHeader"
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
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container mx-auto px-4 pb-24 md:pb-32">
        <div className="border-t border-loc-night/10 pt-8 mb-10">
          <Suspense fallback={<div className="h-12" />}>
            <PropertyFilters />
          </Suspense>
        </div>
        <PropertyGrid type={type} country={country} priceContext={priceContext} />
      </div>
    </>
  )
}
