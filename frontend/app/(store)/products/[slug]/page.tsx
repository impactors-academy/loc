import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export const metadata: Metadata = { title: "Product" }

export default function ProductDetailPage({ params }: Props) {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">Product: {params.slug}</p>
    </div>
  )
}
