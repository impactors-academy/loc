import { ButtonLink } from "@/components/shared/ButtonLink"
import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Link } from "@/i18n/navigation"
import { getPoolImage } from "@/lib/images"
import type { BlogPost } from "@/lib/types"
import { tidyDashes } from "@/lib/text"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getLocale, getTranslations } from "next-intl/server"

export async function JournalPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null
  const t = await getTranslations("home")
  const tb = await getTranslations("blogPage")
  const locale = await getLocale()
  const [lead, ...rest] = posts.slice(0, 3)

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })

  const card = (post: BlogPost, big: boolean) => (
    <article className={cn("group relative flex flex-col", big ? "" : "sm:flex-row lg:flex-col xl:flex-row gap-5")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[20px] bg-loc-sand shrink-0",
          big ? "aspect-[16/11]" : "aspect-[4/3] sm:w-2/5 lg:w-full xl:w-2/5"
        )}
      >
        <Image
          src={post.imageUrl || getPoolImage("default", post.slug, 1200)}
          alt=""
          fill
          className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
          sizes={big ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 40vw, 20vw"}
        />
      </div>
      <div className={cn("flex flex-col", big ? "pt-6" : "pt-1 min-w-0")}>
        <p className="text-[13px] text-loc-stone">
          {post.tags?.[0] && <span className="uppercase tracking-[0.14em] font-semibold text-loc-terracotta mr-3">{post.tags[0]}</span>}
          <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time>
        </p>
        <h3
          className={cn(
            "mt-2 font-heading font-semibold text-loc-night tracking-tight text-balance",
            big ? "text-3xl md:text-4xl leading-[1.05]" : "text-xl leading-snug"
          )}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-loc-terracotta focus-visible:after:rounded-[20px] group-hover:underline decoration-1 underline-offset-4"
          >
            {tidyDashes(post.title)}
          </Link>
        </h3>
        {big && post.excerpt && (
          <p className="mt-3 text-loc-stone text-base leading-relaxed line-clamp-3 max-w-2xl">{tidyDashes(post.excerpt)}</p>
        )}
      </div>
    </article>
  )

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader eyebrow={tb("eyebrow")} title={t("journalTitle")} subtitle={tb("subtitle")} className="mb-12" />
          <ButtonLink href="/blog" variant="outline" arrow className="mb-12">
            {t("journalSeeAll")}
          </ButtonLink>
        </ScrollReveal>

        <ScrollReveal variant="stagger" className="grid lg:grid-cols-12 gap-10">
          <ScrollRevealItem className="lg:col-span-7">{card(lead, true)}</ScrollRevealItem>
          <div className="lg:col-span-5 flex flex-col gap-10">
            {rest.map((post) => (
              <ScrollRevealItem key={post.id}>{card(post, false)}</ScrollRevealItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
