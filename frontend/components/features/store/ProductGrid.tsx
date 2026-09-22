"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useProducts } from "@/hooks/useProducts"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ProductCard } from "./ProductCard"

const SKELETON = Array.from({ length: 6 })

export function ProductGrid() {
  const { data, isPending, isError } = useProducts()
  const t = useTranslations("storePage")

  if (isPending) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {SKELETON.map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted aspect-[3/4] animate-pulse" />
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
      <div className="py-16 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">{t("noProducts")}</p>
        <p className="text-loc-stone text-sm">{t("comingSoon")}</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
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
