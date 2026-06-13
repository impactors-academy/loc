"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { staggerContainer, fadeInUp } from "@/lib/animations"
import { ArticleCard } from "./ArticleCard"

interface RelatedArticlesProps {
  slug: string
}

export function RelatedArticles({ slug }: RelatedArticlesProps) {
  const { data: posts, isPending } = useQuery({
    queryKey: ["blog", slug, "related"],
    queryFn: () => api.blog.related(slug),
    staleTime: 5 * 60 * 1000,
  })

  if (isPending || !posts?.length) return null

  return (
    <section className="mt-20 pt-12 border-t border-border">
      <h2 className="font-heading text-2xl font-bold text-loc-night mb-8">You Might Also Like</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {posts.map((post) => (
          <motion.div key={post.slug} variants={fadeInUp}>
            <ArticleCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
