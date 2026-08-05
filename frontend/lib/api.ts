import { API_BASE_URL } from "./constants"
import type { BlogPost, Experience, InquiryPayload, Product, Property } from "./types"

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

/**
 * Dashboard calls go through the same-origin proxy at /api/admin/*, which
 * attaches EDITOR_API_KEY server-side. Calling the backend directly from here
 * would mean shipping that key to the browser — see the note in
 * app/api/admin/[...path]/route.ts.
 */
async function adminFetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  experiences: {
    list: (category?: string, country?: string, q?: string) => {
      const params = new URLSearchParams()
      if (category) params.set("category", category)
      if (country) params.set("country", country)
      if (q) params.set("q", q)
      const qs = params.toString()
      return fetcher<Experience[]>(`/api/v1/experiences${qs ? `?${qs}` : ""}`)
    },
    get: (slug: string) =>
      fetcher<Experience>(`/api/v1/experiences/${slug}`),
  },

  properties: {
    list: (type?: string, country?: string) => {
      const params = new URLSearchParams()
      if (type) params.set("type", type)
      if (country) params.set("country", country)
      const qs = params.toString()
      return fetcher<Property[]>(`/api/v1/properties${qs ? `?${qs}` : ""}`)
    },
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
    related: (slug: string) => fetcher<BlogPost[]>(`/api/v1/blog/${slug}/related`),
  },

  referrals: {
    click: (slug: string) =>
      fetcher<{ logged: boolean; referral_url: string | null }>(`/api/v1/referrals/click/${slug}`, { method: "POST" }),
  },

  contact: {
    submit: (payload: InquiryPayload) =>
      fetcher<{ success: boolean }>("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          message: payload.message,
          subject: payload.subject,
          source_type: payload.sourceType ?? "general",
          source_id: payload.sourceId ?? null,
        }),
      }),
  },

  admin: {
    experiences: {
      list: () => adminFetcher<Experience[]>("/experiences?limit=100"),
      create: (body: Record<string, unknown>) =>
        adminFetcher<Experience>("/experiences", { method: "POST", body: JSON.stringify(body) }),
      update: (slug: string, body: Record<string, unknown>) =>
        adminFetcher<Experience>(`/experiences/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
      delete: (slug: string) =>
        adminFetcher<void>(`/experiences/${slug}`, { method: "DELETE" }),
    },
    properties: {
      list: () => adminFetcher<Property[]>("/properties?limit=100"),
      create: (body: Record<string, unknown>) =>
        adminFetcher<Property>("/properties", { method: "POST", body: JSON.stringify(body) }),
      update: (slug: string, body: Record<string, unknown>) =>
        adminFetcher<Property>(`/properties/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
      delete: (slug: string) =>
        adminFetcher<void>(`/properties/${slug}`, { method: "DELETE" }),
    },
    blog: {
      list: () => adminFetcher<BlogPost[]>("/blog?limit=100"),
      create: (body: Record<string, unknown>) =>
        adminFetcher<BlogPost>("/blog", { method: "POST", body: JSON.stringify(body) }),
      update: (slug: string, body: Record<string, unknown>) =>
        adminFetcher<BlogPost>(`/blog/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
      delete: (slug: string) =>
        adminFetcher<void>(`/blog/${slug}`, { method: "DELETE" }),
    },
    products: {
      list: () => adminFetcher<Product[]>("/products?limit=100"),
      create: (body: Record<string, unknown>) =>
        adminFetcher<Product>("/products", { method: "POST", body: JSON.stringify(body) }),
      update: (slug: string, body: Record<string, unknown>) =>
        adminFetcher<Product>(`/products/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
      delete: (slug: string) =>
        adminFetcher<void>(`/products/${slug}`, { method: "DELETE" }),
    },
    leads: {
      list: () => adminFetcher<Record<string, unknown>[]>("/leads?limit=100"),
    },
  },
}
