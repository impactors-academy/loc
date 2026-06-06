import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export const metadata: Metadata = { title: "Article" }

export default function BlogPostPage({ params }: Props) {
  return (
    <article className="container mx-auto py-12 px-4 max-w-3xl">
      <p className="text-sm text-muted-foreground">Article: {params.slug}</p>
    </article>
  )
}
