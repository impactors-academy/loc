"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { staggerContainer, fadeInUp } from "@/lib/animations"
import { useTranslations } from "next-intl"
import { ArticleCard } from "./ArticleCard"

interface RelatedArticlesProps {
  slug: string
}

export function RelatedArticles({ slug }: RelatedArticlesProps) {
  const t = useTranslations("blogDetailPage")
  const { data: posts, isPending } = useQuery({
    queryKey: ["blog", slug, "related"],
    queryFn: () => api.blog.related(slug),
    staleTime: 5 * 60 * 1000,
  })

  if (isPending || !posts?.length) return null

  return (
    <section className="mt-24 bg-loc-cream py-20 md:py-28">
      <div className="container mx-auto px-4">
        <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-terracotta mb-4">
          <span className="h-px w-8 bg-loc-terracotta" aria-hidden="true" />
          {t("relatedArticles")}
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-loc-night mb-12">{t("keepReading")}</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={fadeInUp}>
              <ArticleCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
