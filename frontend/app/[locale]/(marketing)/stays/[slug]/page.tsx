import { InquiryForm } from "@/components/shared/InquiryForm"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { PropertyGallery } from "@/components/features/stays/PropertyGallery"
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed"
import { AmenitiesList } from "@/components/features/stays/AmenitiesList"
import { HostCard } from "@/components/features/stays/HostCard"
import { MapLink } from "@/components/features/stays/MapLink"
import { api } from "@/lib/api"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import { formatAmount } from "@/lib/types"
import { Home, MapPin } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const prop = await api.properties.get(slug)
    const title = `${prop.title} | LOC Stays`
    const image = prop.images?.[0]
    return {
      title,
      description: prop.description,
      alternates: { canonical: `/stays/${slug}` },
      openGraph: {
        title,
        description: prop.description,
        url: `/stays/${slug}`,
        type: "website",
        ...(image ? { images: [{ url: image, alt: prop.title }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: prop.description,
        ...(image ? { images: [image] } : {}),
      },
    }
  } catch {
    return { title: "Stay | LOC" }
  }
}

const TYPE_GRADIENTS: Record<string, string> = {
  apartment: "from-slate-900 via-slate-800 to-slate-700",
  villa: "from-emerald-950 via-emerald-900 to-teal-800",
  riad: "from-rose-950 via-rose-900 to-pink-800",
  ryokan: "from-amber-950 via-orange-900 to-amber-800",
  gite: "from-lime-950 via-green-900 to-lime-800",
  hotel: "from-sky-950 via-blue-900 to-sky-800",
  bivouac: "from-stone-950 via-stone-800 to-stone-700",
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations("stayDetailPage")
  const tCommon = await getTranslations("common")
  const tNav = await getTranslations("nav")
  const tp = await getTranslations("propertyTypes")

  let property: Awaited<ReturnType<typeof api.properties.get>> | null = null
  try {
    property = await api.properties.get(slug)
  } catch {
    // render skeleton / not-found fallback below
  }
  const priceContext = await getVisitorPriceContext()

  const gradient =
    property ? (TYPE_GRADIENTS[property.type] ?? "from-loc-night via-loc-night/80 to-loc-stone") : "from-loc-night via-loc-night/80 to-loc-stone"

  const jsonLd = property
    ? {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: property.title,
        description: property.description,
        url: `https://loctravels.com/stays/${slug}`,
        ...(property.images?.length ? { image: property.images } : {}),
        ...(property.location
          ? {
              address: {
                "@type": "PostalAddress",
                addressLocality: property.location,
                ...(property.country ? { addressCountry: property.country } : {}),
              },
            }
          : {}),
        ...(property.priceMin != null
          ? {
              priceRange: property.priceMax != null
                ? `${formatAmount(property.priceMin, property.currency)}-${formatAmount(property.priceMax, property.currency)}`
                : `${formatAmount(property.priceMin, property.currency)}+`,
            }
          : {}),
      }
    : null

  return (
    <main className="pt-24 pb-20">
      {jsonLd && (
        <Script
          id="property-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Hero banner */}
      <div
        className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {property?.images?.[0] && (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end container mx-auto px-4 pb-8">
          {property && (
            <>
              <span className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full uppercase tracking-wide w-fit">
                {tp.has(property.type) ? tp(property.type) : property.type}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-white text-balance">
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
          <Link href="/" className="hover:text-loc-terracotta transition-colors">{t("breadcrumbHome")}</Link>
          <span>/</span>
          <Link href="/stays" className="hover:text-loc-terracotta transition-colors">{tNav("stays")}</Link>
          <span>/</span>
          <span className="text-loc-night">{property?.title ?? slug}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content. 2/3 */}
          <div className="lg:col-span-2">
            {property ? (
              <>
                {property.images.length > 0 && (
                  <PropertyGallery images={property.images} title={property.title} />
                )}
                {property.videoUrl && (
                  <div className="mb-8">
                    <YouTubeEmbed url={property.videoUrl} title={property.title} />
                  </div>
                )}
                <p className="text-loc-stone leading-relaxed text-base mb-8">
                  {property.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 mb-10 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <Home className="w-4 h-4 text-loc-terracotta" />
                    <span className="font-medium text-loc-night">
                      {tp.has(property.type) ? tp(property.type) : property.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <MapPin className="w-4 h-4 text-loc-terracotta" />
                    <span>{property.location}</span>
                  </div>
                  {property.location && <MapLink location={property.location} country={property.country} />}
                </div>
                <AmenitiesList amenities={property.amenities} />
                <HostCard />
                <div className="rounded-2xl bg-loc-sand/40 border border-loc-sand p-6">
                  <p className="text-xs text-loc-stone uppercase tracking-widest mb-1">{t("startingFrom")}</p>
                  <p className="font-heading text-2xl font-semibold text-loc-terracotta">
                    <PriceDisplay
                      min={property.priceMin}
                      max={property.priceMax}
                      currency={property.currency}
                      suffix={tCommon("perNight")}
                      priceContext={priceContext}
                      size="lg"
                    />
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

          {/* Sidebar. 1/3 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-heading text-lg font-semibold text-loc-night mb-1">
                {t("enquireTitle")}
              </p>
              <p className="text-loc-stone text-sm mb-6">
                {t("enquireBody")}
              </p>
              <InquiryForm subject={`Inquiry about stay: ${property?.title ?? slug}`} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
