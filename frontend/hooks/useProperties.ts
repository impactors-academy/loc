import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"

export function useProperties(type?: string, country?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.properties, type, country],
    queryFn: () => api.properties.list(type, country),
  })
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.property(slug),
    queryFn: () => api.properties.get(slug),
    enabled: !!slug,
  })
}
