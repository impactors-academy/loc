"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useExperiences } from "@/hooks/useExperiences"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ExperienceCard } from "./ExperienceCard"

interface ExperienceGridProps {
  category?: string
  country?: string
  q?: string
}

const SKELETON = Array.from({ length: 6 })

export function ExperienceGrid({ category, country, q }: ExperienceGridProps) {
  const { data, isPending, isError } = useExperiences(category, country, q)
  const t = useTranslations("experiencesPage")

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
        {t("loadError")}
      </p>
    )
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">
          {q ? t("noResultsFor", { q }) : t("noResults")}
        </p>
        <p className="text-loc-stone text-sm">{t("tryDifferent")}</p>
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
      {data.map((exp) => (
        <motion.div key={exp.id} variants={fadeInUp}>
          <ExperienceCard experience={exp} />
        </motion.div>
      ))}
    </motion.div>
  )
}
