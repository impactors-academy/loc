import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: () => api.products.list(),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: () => api.products.get(slug),
    enabled: !!slug,
  })
}
