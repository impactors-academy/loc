import { ArticleGrid } from "@/components/features/blog/ArticleGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader title="Tourism Stories" subtitle="Travel tips, hidden gems, and local guides" />
      <ArticleGrid />
    </div>
  )
}
