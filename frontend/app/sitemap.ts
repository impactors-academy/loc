import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loctravels.com"
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/experiences`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/stays`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/store`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/promote`, changeFrequency: "monthly", priority: 0.6 },
    // Dynamic experience/stay/blog/product routes are added here once
    // the API is connected — fetch slugs and map to { url, lastModified }
  ]
}
