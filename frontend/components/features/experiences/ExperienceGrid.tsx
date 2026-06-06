"use client"

import { useExperiences } from "@/hooks/useExperiences"
import { ExperienceCard } from "./ExperienceCard"

interface ExperienceGridProps {
  category?: string
}

export function ExperienceGrid({ category }: ExperienceGridProps) {
  const { data, isLoading, isError } = useExperiences(category)

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-2xl bg-neutral-100 aspect-[4/3] animate-pulse" />)}</div>
  if (isError) return <p className="text-red-500">Failed to load experiences.</p>
  if (!data?.length) return <p className="text-muted-foreground">No experiences found.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((exp) => <ExperienceCard key={exp.id} experience={exp} />)}
    </div>
  )
}
