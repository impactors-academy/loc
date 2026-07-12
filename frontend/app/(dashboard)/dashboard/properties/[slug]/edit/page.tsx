"use client"

import { api } from "@/lib/api"
import type { Property } from "@/lib/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PropertyForm } from "../../_form"

export default function EditPropertyPage() {
  const { slug } = useParams<{ slug: string }>()
  const [item, setItem] = useState<Property | null>(null)

  useEffect(() => { api.properties.get(slug).then(setItem) }, [slug])

  if (!item) return <div className="p-8 text-loc-stone text-sm">Loading…</div>

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">Edit Property</h1>
      <p className="text-loc-stone text-sm mb-8">{item.title}</p>
      <PropertyForm initial={item} editSlug={slug} />
    </div>
  )
}
