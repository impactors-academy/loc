import { ArticleGrid } from "@/components/features/blog/ArticleGrid"
import { PageHeader } from "@/components/shared/PageHeader"
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
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <div className="container mx-auto px-4 pb-24 md:pb-32">
        <div className="border-t border-loc-night/10 pt-10">
          <Suspense fallback={<div className="h-10" />}>
            <ArticleGrid tag={tag} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
