"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useProperties } from "@/hooks/useProperties"
import { motion } from "framer-motion"
import { PropertyCard } from "./PropertyCard"

interface PropertyGridProps {
  type?: string
  country?: string
}

const SKELETON = Array.from({ length: 6 })

export function PropertyGrid({ type, country }: PropertyGridProps) {
  const { data, isPending, isError } = useProperties(type, country)

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETON.map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted aspect-[4/3] animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-loc-stone text-sm py-16 text-center">
        Could not load properties right now. Please try again later.
      </p>
    )
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">No properties found</p>
        <p className="text-loc-stone text-sm">Try a different type or check back soon.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {data.map((prop) => (
        <motion.div key={prop.id} variants={fadeInUp}>
          <PropertyCard property={prop} />
        </motion.div>
      ))}
    </motion.div>
  )
}
