import { API_BASE_URL } from "./constants"
import type { BlogPost, Experience, InquiryPayload, Product, Property } from "./types"

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export const api = {
  experiences: {
    list: (category?: string) =>
      fetcher<Experience[]>(`/api/v1/experiences${category ? `?category=${category}` : ""}`),
    get: (slug: string) =>
      fetcher<Experience>(`/api/v1/experiences/${slug}`),
  },

  properties: {
    list: (type?: string) =>
      fetcher<Property[]>(`/api/v1/properties${type ? `?type=${type}` : ""}`),
    get: (slug: string) =>
      fetcher<Property>(`/api/v1/properties/${slug}`),
  },

  products: {
    list: () => fetcher<Product[]>("/api/v1/products"),
    get: (slug: string) => fetcher<Product>(`/api/v1/products/${slug}`),
  },

  blog: {
    list: (tag?: string) =>
      fetcher<BlogPost[]>(`/api/v1/blog${tag ? `?tag=${tag}` : ""}`),
    get: (slug: string) => fetcher<BlogPost>(`/api/v1/blog/${slug}`),
  },

  contact: {
    submit: (payload: InquiryPayload) =>
      fetcher<{ success: boolean }>("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
}
