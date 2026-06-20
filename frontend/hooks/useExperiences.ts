import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"

export function useExperiences(category?: string, country?: string, q?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.experiences, category, country, q],
    queryFn: () => api.experiences.list(category, country, q),
  })
}

export function useExperience(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.experience(slug),
    queryFn: () => api.experiences.get(slug),
    enabled: !!slug,
  })
}
