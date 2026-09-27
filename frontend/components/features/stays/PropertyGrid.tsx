"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useProperties } from "@/hooks/useProperties"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { PropertyCard } from "./PropertyCard"
import type { VisitorPriceContext } from "@/lib/price-display"

interface PropertyGridProps {
  type?: string
  country?: string
  priceContext?: VisitorPriceContext | null
}

const SKELETON = Array.from({ length: 8 })
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12"

export function PropertyGrid({ type, country, priceContext }: PropertyGridProps) {
  const { data, isPending, isError } = useProperties(type, country)
  const t = useTranslations("staysPage")

  if (isPending) {
    return (
      <div className={GRID} aria-busy="true">
        {SKELETON.map((_, i) => (
          <div key={i}>
            <div className="rounded-[20px] bg-loc-night/[0.06] aspect-[4/5] animate-pulse" />
            <div className="mt-4 h-3 w-1/3 rounded bg-loc-night/[0.06] animate-pulse" />
            <div className="mt-3 h-4 w-3/4 rounded bg-loc-night/[0.06] animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-loc-stone text-sm py-16 text-center">
        {t("loadError")}
      </p>
    )
  }

  if (!data?.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-3xl font-semibold tracking-tight text-loc-night mb-3">{t("noResults")}</p>
        <p className="text-loc-stone text-sm">{t("tryDifferent")}</p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-loc-stone" aria-live="polite">{t("resultsCount", { count: data.length })}</p>
      <motion.div className={GRID} variants={staggerContainer} initial="hidden" animate="show">
        {data.map((prop) => (
          <motion.div key={prop.id} variants={fadeInUp}>
            <PropertyCard property={prop} priceContext={priceContext} />
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}
