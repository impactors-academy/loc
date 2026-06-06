import type { Product } from "@/lib/types"
import Link from "next/link"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-neutral-100">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-muted-foreground capitalize">{product.type}</span>
        <h3 className="font-semibold text-base mt-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold">${product.price}</span>
          <Link
            href={product.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-neutral-800 transition-colors"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  )
}
