"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useExperiences } from "@/hooks/useExperiences"
import { ButtonLink } from "@/components/shared/ButtonLink"
import { ComingSoon } from "@/components/shared/ComingSoon"
import { Link } from "@/i18n/navigation"
import { Compass } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ExperienceCard } from "./ExperienceCard"

interface ExperienceGridProps {
  category?: string
  country?: string
  q?: string
}

const SKELETON = Array.from({ length: 8 })
const GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12"

export function ExperienceGrid({ category, country, q }: ExperienceGridProps) {
  const { data, isPending, isError } = useExperiences(category, country, q)
  const t = useTranslations("experiencesPage")
  const tCommon = useTranslations("common")

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
    const hasActiveFilters = q || category || country

    if (q) {
      return (
        <div className="py-20 text-center max-w-sm mx-auto">
          <p className="font-heading text-3xl font-semibold tracking-tight text-loc-night mb-3">
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
        <div className="py-20 text-center">
          <p className="font-heading text-3xl font-semibold tracking-tight text-loc-night mb-3">{t("noResults")}</p>
          <p className="text-loc-stone text-sm">{t("tryDifferent")}</p>
        </div>
      )
    }

    return (
      <ComingSoon
        badge={tCommon("comingSoon")}
        icon={Compass}
        title={t("emptyTitle")}
        body={t("emptyBody")}
        actions={
          <>
            <ButtonLink href="/stays" size="lg" arrow>{t("emptyBrowse")}</ButtonLink>
            <ButtonLink href="/blog" size="lg" variant="ghost-light">{t("emptyStories")}</ButtonLink>
          </>
        }
      />
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-loc-stone" aria-live="polite">{t("resultsCount", { count: data.length })}</p>
      <motion.div className={GRID} variants={staggerContainer} initial="hidden" animate="show">
        {data.map((exp) => (
          <motion.div key={exp.id} variants={fadeInUp}>
            <ExperienceCard experience={exp} />
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}
