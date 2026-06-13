import { ArticleGrid } from "@/components/features/blog/ArticleGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Morocco Travel Guide & Stories | LOC Blog",
  description:
    "Discover hidden gems, local tips, and travel stories from across Morocco — written by people who live and breathe it.",
  alternates: { canonical: "/blog" },
}

interface Props {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow="From the field"
            title="Morocco Stories"
            subtitle="Hidden gems, local tips, and travel guides written by people who live here."
          />
        </div>
        <Suspense fallback={<div className="h-10" />}>
          <ArticleGrid tag={tag} />
        </Suspense>
      </div>
    </main>
  )
}
