import { InquiryForm } from "@/components/shared/InquiryForm"
import { api } from "@/lib/api"
import { Home, MapPin } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const prop = await api.properties.get(slug)
    return {
      title: `${prop.title} | LOC Stays`,
      description: prop.description,
    }
  } catch {
    return { title: "Stay | LOC" }
  }
}

const TYPE_GRADIENTS: Record<string, string> = {
  apartment: "from-slate-900 via-slate-800 to-slate-700",
  villa: "from-emerald-950 via-emerald-900 to-teal-800",
  "vacation-home": "from-amber-950 via-orange-900 to-amber-800",
  "local-stay": "from-rose-950 via-rose-900 to-pink-800",
}

const TYPE_LABELS: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  "vacation-home": "Vacation Home",
  "local-stay": "Local Stay",
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params

  let property: Awaited<ReturnType<typeof api.properties.get>> | null = null
  try {
    property = await api.properties.get(slug)
  } catch {
    // render skeleton / not-found fallback below
  }

  const gradient =
    property ? (TYPE_GRADIENTS[property.type] ?? "from-loc-night via-loc-night/80 to-loc-stone") : "from-loc-night via-loc-night/80 to-loc-stone"

  return (
    <main className="pt-24 pb-20">
      {/* Hero banner */}
      <div
        className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {property?.imageUrl && (
          <img
            src={property.imageUrl}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end container mx-auto px-4 pb-8">
          {property && (
            <>
              <span className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full uppercase tracking-wide w-fit">
                {TYPE_LABELS[property.type] ?? property.type}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white text-balance">
                {property.title}
              </h1>
              <p className="mt-2 text-white/70 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {property.location}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="flex items-center gap-2 text-xs text-loc-stone mb-8">
          <Link href="/" className="hover:text-loc-terracotta transition-colors">Home</Link>
          <span>/</span>
          <Link href="/stays" className="hover:text-loc-terracotta transition-colors">Stays</Link>
          <span>/</span>
          <span className="text-loc-night">{property?.title ?? slug}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2">
            {property ? (
              <>
                <p className="text-loc-stone leading-relaxed text-base mb-8">
                  {property.description}
                </p>
                <div className="flex flex-wrap gap-6 mb-10 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <Home className="w-4 h-4 text-loc-terracotta" />
                    <span className="font-medium text-loc-night">
                      {TYPE_LABELS[property.type] ?? property.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <MapPin className="w-4 h-4 text-loc-terracotta" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-loc-sand/40 border border-loc-sand p-6">
                  <p className="text-xs text-loc-stone uppercase tracking-widest mb-1">Starting from</p>
                  <p className="font-heading text-2xl font-bold text-loc-terracotta">
                    {property.priceRange}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${75 + i * 5}%` }} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-heading text-lg font-semibold text-loc-night mb-1">
                Enquire about this stay
              </p>
              <p className="text-loc-stone text-sm mb-6">
                Message the host directly — no middleman, no platform fees.
              </p>
              <InquiryForm subject={`Inquiry about stay: ${property?.title ?? slug}`} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
