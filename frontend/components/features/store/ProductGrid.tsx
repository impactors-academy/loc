"use client"

import { ButtonLink } from "@/components/shared/ButtonLink"
import { ComingSoon } from "@/components/shared/ComingSoon"
import { BookOpen } from "lucide-react"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useProducts } from "@/hooks/useProducts"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ProductCard } from "./ProductCard"

const SKELETON = Array.from({ length: 6 })

export function ProductGrid() {
  const { data, isPending, isError } = useProducts()
  const t = useTranslations("storePage")
  const tCommon = useTranslations("common")
  const tNav = useTranslations("nav")

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {SKELETON.map((_, i) => (
          <div key={i} className="rounded-[20px] bg-loc-night/[0.06] aspect-[3/4] animate-pulse" />
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
      <ComingSoon
        badge={tCommon("comingSoon")}
        icon={BookOpen}
        title={t("soonTitle")}
        body={t("comingSoon")}
        actions={<ButtonLink href="/stays" size="lg" arrow>{tNav("stays")}</ButtonLink>}
      />
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {data.map((product) => (
        <motion.div key={product.id} variants={fadeInUp}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
