"use client"

import { api } from "@/lib/api"
import type { Product } from "@/lib/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProductForm } from "../../_form"

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [item, setItem] = useState<Product | null>(null)

  useEffect(() => { api.products.get(slug).then(setItem) }, [slug])

  if (!item) return <div className="p-8 text-loc-stone text-sm">Loading…</div>

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold text-loc-night mb-1">Edit Product</h1>
      <p className="text-loc-stone text-sm mb-8">{item.title}</p>
      <ProductForm initial={item} editSlug={slug} />
    </div>
  )
}
