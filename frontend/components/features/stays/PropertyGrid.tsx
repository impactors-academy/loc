"use client"

import { useProperties } from "@/hooks/useProperties"
import { PropertyCard } from "./PropertyCard"

interface PropertyGridProps {
  type?: string
}

export function PropertyGrid({ type }: PropertyGridProps) {
  const { data, isLoading, isError } = useProperties(type)

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-2xl bg-neutral-100 aspect-[4/3] animate-pulse" />)}</div>
  if (isError) return <p className="text-red-500">Failed to load properties.</p>
  if (!data?.length) return <p className="text-muted-foreground">No properties found.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((prop) => <PropertyCard key={prop.id} property={prop} />)}
    </div>
  )
}
