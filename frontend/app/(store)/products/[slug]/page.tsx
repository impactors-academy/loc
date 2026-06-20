import { api } from "@/lib/api"
import { ExternalLink, Tag } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const product = await api.products.get(slug)
    return {
      title: `${product.title} | LOC Store`,
      description: product.description ?? undefined,
      alternates: { canonical: `/products/${slug}` },
    }
  } catch {
    return { title: "Product | LOC Store" }
  }
}

const TYPE_GRADIENTS: Record<string, string> = {
  guide: "from-amber-950 via-orange-900 to-amber-800",
  map: "from-teal-950 via-emerald-900 to-teal-800",
  photography: "from-rose-950 via-pink-900 to-rose-800",
  template: "from-indigo-950 via-blue-900 to-indigo-800",
}

const TYPE_LABELS: Record<string, string> = {
  guide: "Travel Guide",
  map: "Map",
  photography: "Photography Pack",
  template: "Template",
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  let product: Awaited<ReturnType<typeof api.products.get>> | null = null
  try {
    product = await api.products.get(slug)
  } catch {
    // skeleton fallback below
  }

  const gradient = product
    ? (TYPE_GRADIENTS[product.type] ?? "from-loc-night via-loc-night/80 to-loc-stone")
    : "from-loc-night via-loc-night/80 to-loc-stone"

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-loc-stone mb-8">
          <Link href="/" className="hover:text-loc-terracotta transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-loc-terracotta transition-colors">Store</Link>
          <span>/</span>
          <span className="text-loc-night">{product?.title ?? slug}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Cover image */}
          <div className={`relative rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-br ${gradient}`}>
            {product?.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          {/* Detail + CTA */}
          <div>
            {product ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} className="text-loc-terracotta" />
                  <span className="text-xs font-medium text-loc-stone uppercase tracking-wide">
                    {TYPE_LABELS[product.type] ?? product.type}
                  </span>
                </div>
                <h1 className="font-heading text-3xl font-bold text-loc-night mb-4">
                  {product.title}
                </h1>
                <p className="text-loc-stone leading-relaxed mb-8">{product.description}</p>

                <div className="rounded-2xl bg-loc-sand/40 border border-loc-sand p-6 mb-6">
                  <p className="text-xs text-loc-stone uppercase tracking-widest mb-1">Price</p>
                  <p className="font-heading text-3xl font-bold text-loc-terracotta">
                    €{product.price.toFixed(2)}
                  </p>
                </div>

                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-loc-terracotta text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-loc-terracotta/90 transition-all hover:scale-[1.02] shadow-md"
                >
                  Buy now <ExternalLink size={16} />
                </a>
                <p className="text-xs text-loc-stone/70 text-center mt-3">
                  Secure checkout via our trusted partner
                </p>
              </>
            ) : (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${80 - i * 8}%` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
