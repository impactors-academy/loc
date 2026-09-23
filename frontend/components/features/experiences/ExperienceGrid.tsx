"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useExperiences } from "@/hooks/useExperiences"
import { Link } from "@/i18n/navigation"
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
    const hasActiveFilters = q || category || country

    if (q) {
      return (
        <div className="py-16 text-center max-w-sm mx-auto">
          <p className="font-heading text-xl text-loc-night mb-2">
            {t("noResultsFor", { q })}
          </p>
          <p className="text-loc-stone text-sm mb-6">{t("tryDifferent")}</p>
          <Link
            href="/experiences"
            className="inline-flex items-center px-5 py-2 rounded-full border border-loc-stone/30 text-loc-stone text-sm font-medium hover:border-loc-terracotta hover:text-loc-terracotta transition-colors"
          >
            {t("clearSearch")}
          </Link>
        </div>
      )
    }

    if (hasActiveFilters) {
      return (
        <div className="py-16 text-center">
          <p className="font-heading text-xl text-loc-night mb-2">{t("noResults")}</p>
          <p className="text-loc-stone text-sm">{t("tryDifferent")}</p>
        </div>
      )
    }

    return (
      <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-10">
          {["🏔️", "🧘", "🏛️", "🍽️", "🪂", "🌊"].map((icon, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-2xl bg-loc-sand flex items-center justify-center text-2xl opacity-60"
            >
              {icon}
            </div>
          ))}
        </div>
        <h2 className="font-heading text-2xl font-semibold text-loc-night mb-3">
          {t("emptyTitle")}
        </h2>
        <p className="text-loc-stone text-sm leading-relaxed mb-8">
          {t("emptyBody")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/stays"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-loc-terracotta text-white text-sm font-semibold hover:bg-loc-terracotta/90 transition-all"
          >
            {t("emptyBrowse")}
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-loc-stone/30 text-loc-stone text-sm font-medium hover:border-loc-terracotta hover:text-loc-terracotta transition-colors"
          >
            {t("emptyStories")}
          </Link>
        </div>
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
