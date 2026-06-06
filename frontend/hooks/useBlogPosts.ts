import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"

export function useBlogPosts(tag?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.blogPosts, tag],
    queryFn: () => api.blog.list(tag),
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.blogPost(slug),
    queryFn: () => api.blog.get(slug),
    enabled: !!slug,
  })
}
