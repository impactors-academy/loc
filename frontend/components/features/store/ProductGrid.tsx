"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useProducts } from "@/hooks/useProducts"
import { motion } from "framer-motion"
import { ProductCard } from "./ProductCard"

const SKELETON = Array.from({ length: 6 })

export function ProductGrid() {
  const { data, isPending, isError } = useProducts()

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
        Could not load products right now. Please try again later.
      </p>
    )
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">No products yet</p>
        <p className="text-loc-stone text-sm">Check back soon — new guides are on the way.</p>
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
