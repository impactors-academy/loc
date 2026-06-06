"use client"

import { useBlogPosts } from "@/hooks/useBlogPosts"
import { ArticleCard } from "./ArticleCard"

export function ArticleGrid() {
  const { data, isLoading, isError } = useBlogPosts()

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-2xl bg-neutral-100 aspect-video animate-pulse" />)}</div>
  if (isError) return <p className="text-red-500">Failed to load articles.</p>
  if (!data?.length) return <p className="text-muted-foreground">No articles yet.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((post) => <ArticleCard key={post.id} post={post} />)}
    </div>
  )
}
