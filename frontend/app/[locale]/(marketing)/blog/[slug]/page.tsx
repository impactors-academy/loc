import { JsonLd } from "@/components/shared/JsonLd"
import { api } from "@/lib/api"
import { ReadingProgress, ShareButtons } from "@/components/features/blog/ArticleChrome"
import { RelatedArticles } from "@/components/features/blog/RelatedArticles"
import { Breadcrumbs } from "@/components/shared/DetailParts"
import { Link } from "@/i18n/navigation"
import { tidyDashes } from "@/lib/text"
import { ArrowLeft } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import Image from "next/image"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await api.blog.get(slug)
    return {
      title: `${tidyDashes(post.title)} | LOC Blog`,
      description: post.excerpt ?? undefined,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt ?? undefined,
        publishedTime: post.publishedAt,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
      },
    }
  } catch {
    return { title: "Article | LOC Blog" }
  }
}

const WORDS_PER_MINUTE = 225

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()

// The Q&A block is authored as <h2 id="faq"> followed by <h3> question / <p>
// answer pairs (see content/strategy/BLOG-GUIDELINES.md). Turning it into
// FAQPage data lets search and AI answer engines read the questions directly.
function extractFaq(html: string): { q: string; a: string }[] {
  const start = html.search(/<h2[^>]*id="faq"[^>]*>/i)
  if (start === -1) return []
  const rest = html.slice(start + 1)
  const end = rest.search(/<h2[\s>]/i)
  const block = end === -1 ? rest : rest.slice(0, end)
  const pairs: { q: string; a: string }[] = []
  for (const m of block.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    pairs.push({ q: stripTags(m[1]), a: stripTags(m[2]) })
  }
  return pairs
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations("blogDetailPage")
  const tNav = await getTranslations("nav")
  const locale = await getLocale()

  let post: Awaited<ReturnType<typeof api.blog.get>> | null = null
  try {
    post = await api.blog.get(slug)
  } catch {
    // skeleton fallback below
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 max-w-3xl pt-32 pb-24 space-y-4">
        <div className="h-4 w-1/4 bg-loc-night/[0.06] rounded animate-pulse" />
        <div className="h-14 w-full bg-loc-night/[0.06] rounded animate-pulse" />
        <div className="h-14 w-2/3 bg-loc-night/[0.06] rounded animate-pulse" />
      </div>
    )
  }

  const date = new Date(post.publishedAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
  const words = (post.content || post.excerpt || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  const kicker = post.tags?.[0]

  const faq = post.content ? extractFaq(post.content) : []
  const faqLd =
    faq.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }
      : null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    ...(post.imageUrl ? { image: [post.imageUrl] } : {}),
    author: { "@type": "Organization", name: "LOC", url: "https://loctravels.com" },
    publisher: { "@type": "Organization", name: "LOC", url: "https://loctravels.com" },
    mainEntityOfPage: `https://loctravels.com/blog/${slug}`,
  }

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      {faqLd && (
        <JsonLd data={faqLd} />
      )}

      <article className="pt-28 md:pt-36">
        {/* Masthead: kicker, headline, standfirst, byline. The same order the
            major newsrooms use, so the reader knows what and who before why. */}
        <header className="container mx-auto px-4 max-w-[752px]">
          <Breadcrumbs items={[{ label: t("breadcrumbHome"), href: "/" }, { label: tNav("blog"), href: "/blog" }]} />

          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold uppercase tracking-[0.18em]">
            {kicker && (
              <Link href={`/blog?tag=${encodeURIComponent(kicker)}`} className="text-loc-terracotta hover:text-loc-night transition-colors">
                {kicker}
              </Link>
            )}
            {kicker && <span className="h-1 w-1 rounded-full bg-loc-stone/50" aria-hidden="true" />}
            <span className="text-loc-stone">{t("minRead", { count: minutes })}</span>
          </p>

          <h1 className="mt-5 font-heading font-semibold text-loc-night tracking-[-0.035em] leading-[0.98] text-balance text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">
            {tidyDashes(post.title)}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-xl md:text-2xl leading-snug text-loc-night/70 max-w-3xl text-pretty">
              {tidyDashes(post.excerpt)}
            </p>
          )}

          <div className="mt-10 py-5 border-y border-loc-night/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/icons/loc-mark.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
              <div className="text-sm">
                <p className="font-semibold text-loc-night">{t("by", { name: t("editorial") })}</p>
                <p className="text-loc-stone">
                  <time dateTime={post.publishedAt}>{date}</time>
                </p>
              </div>
            </div>
            <ShareButtons title={post.title} />
          </div>
        </header>

        {post.imageUrl && (
          <figure className="container mx-auto px-4 max-w-6xl mt-10 md:mt-14">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-loc-sand">
              <Image src={post.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1152px" priority />
            </div>
          </figure>
        )}

        <div className="container mx-auto px-4 mt-12 md:mt-16">
          {post.content ? (
            <div
              id="article-body"
              className="article-body mx-auto max-w-[720px]"
              dangerouslySetInnerHTML={{ __html: tidyDashes(post.content) }}
            />
          ) : (
            <p id="article-body" className="mx-auto max-w-[720px] text-xl leading-relaxed text-loc-night/80">
              {post.excerpt}
            </p>
          )}

          <footer className="mx-auto max-w-[720px] mt-16 pt-8 border-t border-loc-night/10 flex flex-wrap items-center justify-between gap-6">
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-loc-stone mr-1">{t("filedUnder")}</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="glass-light rounded-full px-3.5 py-1.5 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <ShareButtons title={post.title} />
          </footer>

          <div className="mx-auto max-w-[720px] mt-10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-loc-night hover:text-loc-terracotta transition-colors">
              <ArrowLeft size={16} aria-hidden="true" />
              {t("backToStories")}
            </Link>
          </div>
        </div>
      </article>

      <RelatedArticles slug={slug} />
    </>
  )
}
