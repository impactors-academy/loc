"use client"

import { Link } from "@/i18n/navigation"
import { getPoolImage } from "@/lib/images"
import { tidyDashes } from "@/lib/text"
import type { BlogPost } from "@/lib/types"
import Image from "next/image"
import { useLocale } from "next-intl"

export function ArticleCard({ post }: { post: BlogPost }) {
  const locale = useLocale()
  const date = new Date(post.publishedAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-loc-sand">
        <Image
          src={post.imageUrl || getPoolImage("default", post.slug, 1200)}
          alt=""
          fill
          className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="pt-5 flex flex-col flex-1">
        <p className="text-[13px] text-loc-stone">
          {post.tags?.[0] && (
            <span className="uppercase tracking-[0.14em] font-semibold text-loc-terracotta mr-3">{post.tags[0]}</span>
          )}
          <time dateTime={post.publishedAt}>{date}</time>
        </p>
        <h3 className="mt-2 font-heading font-semibold text-loc-night text-xl leading-snug tracking-tight line-clamp-2 text-balance">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-loc-terracotta focus-visible:after:rounded-[20px] group-hover:underline decoration-1 underline-offset-4"
          >
            {tidyDashes(post.title)}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 text-loc-stone text-[15px] leading-relaxed line-clamp-2">{tidyDashes(post.excerpt)}</p>}
      </div>
    </article>
  )
}
