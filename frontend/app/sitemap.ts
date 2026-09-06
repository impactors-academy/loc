import type { MetadataRoute } from "next"
import { api } from "@/lib/api"
import { routing } from "@/i18n/routing"

const BASE_URL = "https://loctravels.com"

function localePath(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

function alternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path)
  }
  return { languages }
}

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>

function entry(path: string, priority: number, changeFrequency: ChangeFrequency): MetadataRoute.Sitemap[number] {
  return {
    url: localePath(routing.defaultLocale, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: alternates(path),
  }
}

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: ChangeFrequency }> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/experiences", priority: 0.9, changeFrequency: "daily" },
  { path: "/stays", priority: 0.9, changeFrequency: "daily" },
  { path: "/store", priority: 0.8, changeFrequency: "daily" },
  { path: "/destinations", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/promote", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.map(({ path, priority, changeFrequency }) =>
    entry(path, priority, changeFrequency)
  )

  const [experiences, properties, products, blogPosts] = await Promise.all([
    api.experiences.list().catch(() => []),
    api.properties.list().catch(() => []),
    api.products.list().catch(() => []),
    api.blog.list().catch(() => []),
  ])

  const dynamicEntries = [
    ...experiences.map((e) => entry(`/experiences/${e.slug}`, 0.7, "weekly")),
    ...properties.map((p) => entry(`/stays/${p.slug}`, 0.7, "weekly")),
    ...products.map((p) => entry(`/products/${p.slug}`, 0.6, "weekly")),
    ...blogPosts.map((b) => entry(`/blog/${b.slug}`, 0.6, "weekly")),
  ]

  return [...staticEntries, ...dynamicEntries]
}
