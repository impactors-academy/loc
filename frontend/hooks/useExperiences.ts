import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"

export function useExperiences(category?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.experiences, category],
    queryFn: () => api.experiences.list(category),
  })
}

export function useExperience(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.experience(slug),
    queryFn: () => api.experiences.get(slug),
    enabled: !!slug,
  })
}
