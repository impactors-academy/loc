"use client"

import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "./ProductCard"

export function ProductGrid() {
  const { data, isLoading, isError } = useProducts()

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-2xl bg-neutral-100 aspect-square animate-pulse" />)}</div>
  if (isError) return <p className="text-red-500">Failed to load products.</p>
  if (!data?.length) return <p className="text-muted-foreground">No products yet.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
