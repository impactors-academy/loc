"use client"

import { ButtonLink } from "@/components/shared/ButtonLink"
import { ComingSoon } from "@/components/shared/ComingSoon"
import { Feather } from "lucide-react"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useBlogPosts } from "@/hooks/useBlogPosts"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { ArticleCard } from "./ArticleCard"

interface ArticleGridProps {
  tag?: string
}

const SKELETON = Array.from({ length: 6 })

export function ArticleGrid({ tag }: ArticleGridProps) {
  const { data, isPending, isError } = useBlogPosts(tag)
  const t = useTranslations("blogPage")
  const tCommon = useTranslations("common")
  const tNav = useTranslations("nav")

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {SKELETON.map((_, i) => (
          <div key={i} className="rounded-[20px] bg-loc-night/[0.06] aspect-video animate-pulse" />
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
    if (!tag) {
      return (
        <ComingSoon
          badge={tCommon("comingSoon")}
          icon={Feather}
          title={t("soonTitle")}
          body={t("comingSoon")}
          actions={<ButtonLink href="/stays" size="lg" arrow>{tNav("stays")}</ButtonLink>}
        />
      )
    }
    return (
      <div className="py-20 text-center">
        <p className="font-heading text-3xl font-semibold tracking-tight text-loc-night mb-3">{t("noArticlesTagged", { tag })}</p>
        <p className="text-loc-stone">{t("tryDifferentTag")}</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {data.map((post) => (
        <motion.div key={post.id} variants={fadeInUp}>
          <ArticleCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  )
}
