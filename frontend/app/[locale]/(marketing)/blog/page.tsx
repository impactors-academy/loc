import { ArticleGrid } from "@/components/features/blog/ArticleGrid"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { Suspense } from "react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blogPage")
  return {
    title: `${t("metaTitle")} | LOC Blog`,
    description: t("metaDescription"),
    alternates: { canonical: "/blog" },
  }
}

interface Props {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams
  const t = await getTranslations("blogPage")

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </div>
        <Suspense fallback={<div className="h-10" />}>
          <ArticleGrid tag={tag} />
        </Suspense>
      </div>
    </main>
  )
}
