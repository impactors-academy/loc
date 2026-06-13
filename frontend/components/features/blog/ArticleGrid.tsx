"use client"

import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useBlogPosts } from "@/hooks/useBlogPosts"
import { motion } from "framer-motion"
import { ArticleCard } from "./ArticleCard"

interface ArticleGridProps {
  tag?: string
}

const SKELETON = Array.from({ length: 6 })

export function ArticleGrid({ tag }: ArticleGridProps) {
  const { data, isPending, isError } = useBlogPosts(tag)

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKELETON.map((_, i) => (
          <div key={i} className="rounded-2xl bg-muted aspect-video animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-loc-stone text-sm py-16 text-center">
        Could not load articles right now. Please try again later.
      </p>
    )
  }

  if (!data?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl text-loc-night mb-2">No articles yet</p>
        <p className="text-loc-stone text-sm">Stories from across Morocco are coming soon.</p>
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
      {data.map((post) => (
        <motion.div key={post.id} variants={fadeInUp}>
          <ArticleCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  )
}
