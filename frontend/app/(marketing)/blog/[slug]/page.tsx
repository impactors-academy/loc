import { api } from "@/lib/api"
import { RelatedArticles } from "@/components/features/blog/RelatedArticles"
import { CalendarDays } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await api.blog.get(slug)
    return {
      title: `${post.title} | LOC Blog`,
      description: post.excerpt ?? undefined,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt ?? undefined,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      },
    }
  } catch {
    return { title: "Article | LOC Blog" }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post: Awaited<ReturnType<typeof api.blog.get>> | null = null
  try {
    post = await api.blog.get(slug)
  } catch {
    // skeleton fallback below
  }

  const date = post
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-loc-stone mb-8">
          <Link href="/" className="hover:text-loc-terracotta transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-loc-terracotta transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-loc-night line-clamp-1">{post?.title ?? slug}</span>
        </div>

        {post ? (
          <article>
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs font-medium text-loc-terracotta bg-loc-sand/60 hover:bg-loc-sand px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-loc-night leading-tight mb-4">
              {post.title}
            </h1>

            {date && (
              <p className="flex items-center gap-1.5 text-sm text-loc-stone mb-8">
                <CalendarDays size={14} />
                {date}
              </p>
            )}

            {/* Hero image */}
            {post.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden aspect-video mb-10">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 728px"
                  priority
                />
              </div>
            )}

            {/* Content */}
            {post.content ? (
              <div
                className="prose prose-stone prose-headings:font-heading prose-a:text-loc-terracotta prose-a:no-underline hover:prose-a:underline max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              post.excerpt && (
                <p className="text-loc-stone leading-relaxed text-lg">{post.excerpt}</p>
              )
            )}
          </article>
        ) : (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${90 - i * 5}%` }} />
            ))}
          </div>
        )}

        {post && <RelatedArticles slug={slug} />}

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-loc-terracotta hover:text-loc-terracotta/80 transition-colors"
          >
            ← Back to all stories
          </Link>
        </div>
      </div>
    </main>
  )
}
