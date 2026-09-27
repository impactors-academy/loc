import { InquiryForm } from "@/components/shared/InquiryForm"
import { TrustStrip } from "@/components/shared/TrustStrip"
import { PriceDisplay } from "@/components/shared/PriceDisplay"
import { PropertyGallery } from "@/components/features/stays/PropertyGallery"
import { YouTubeEmbed } from "@/components/shared/YouTubeEmbed"
import { AmenitiesList } from "@/components/features/stays/AmenitiesList"
import { HostCard } from "@/components/features/stays/HostCard"
import { MapLink } from "@/components/features/stays/MapLink"
import { Breadcrumbs, Fact, MobileEnquireBar } from "@/components/shared/DetailParts"
import { api } from "@/lib/api"
import { getVisitorPriceContext } from "@/lib/price-display-context"
import { formatAmount } from "@/lib/types"
import { Globe, Home, MapPin } from "lucide-react"
import { splitTitle, tidyDashes } from "@/lib/text"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import Script from "next/script"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const prop = await api.properties.get(slug)
    const title = `${tidyDashes(prop.title)} | LOC Stays`
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

  const typeLabel = property ? (tp.has(property.type) ? tp(property.type) : property.type) : ""
  const price = property ? (
    <PriceDisplay
      min={property.priceMin}
      max={property.priceMax}
      currency={property.currency}
      suffix={tCommon("perNight")}
      priceContext={priceContext}
      size="lg"
    />
  ) : null

  return (
    <div className="pt-28 md:pt-32 pb-28 lg:pb-32">
      {jsonLd && (
        <Script
          id="property-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: t("breadcrumbHome"), href: "/" },
            { label: tNav("stays"), href: "/stays" },
            { label: property ? splitTitle(property.title).name : slug },
          ]}
        />

        {property ? (
          <>
            <div className="mt-6 mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div className="max-w-4xl">
                <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-terracotta mb-4">
                  <span className="h-px w-8 bg-loc-terracotta" aria-hidden="true" />
                  {typeLabel}
                </p>
                <h1 className="font-heading text-4xl md:text-6xl font-semibold text-loc-night tracking-[-0.03em] leading-[0.95] text-balance">
                  {splitTitle(property.title).name}
                </h1>
                {splitTitle(property.title).detail && (
                  <p className="mt-3 font-heading text-xl md:text-2xl text-loc-stone tracking-tight">{splitTitle(property.title).detail}</p>
                )}
              </div>
              <p className="flex items-center gap-2 text-loc-stone shrink-0">
                <MapPin size={16} className="text-loc-terracotta" aria-hidden="true" />
                {property.location}
                {property.country && !property.location.includes(property.country) ? `, ${property.country}` : ""}
              </p>
            </div>

            {property.images.length > 0 && (
              <PropertyGallery
                images={property.images}
                title={property.title}
                showAllLabel={tCommon("showAllPhotos", { count: property.images.length })}
              />
            )}

            <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-7 xl:col-span-8">
                <section className="pb-10 border-b border-loc-night/10">
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-loc-night mb-5">{t("aboutTitle")}</h2>
                  <p className="text-loc-night/80 text-lg leading-relaxed whitespace-pre-line text-pretty">{tidyDashes(property.description)}</p>
                </section>

                <section className="py-10 border-b border-loc-night/10 grid sm:grid-cols-3 gap-6">
                  <Fact icon={<Home size={18} />} label={tCommon("typeLabel")} value={typeLabel} />
                  <Fact icon={<MapPin size={18} />} label={tCommon("locationLabel")} value={property.location} />
                  {property.country && <Fact icon={<Globe size={18} />} label={tCommon("countryLabel")} value={property.country} />}
                </section>

                {property.videoUrl && (
                  <section className="py-10 border-b border-loc-night/10">
                    <YouTubeEmbed url={property.videoUrl} title={property.title} />
                  </section>
                )}

                <AmenitiesList amenities={property.amenities} />

                <section className="py-10 border-b border-loc-night/10">
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-loc-night mb-5">{t("whereTitle")}</h2>
                  <p className="text-loc-night/80 mb-4">
                    {property.location}
                    {property.country && !property.location.includes(property.country) ? `, ${property.country}` : ""}
                  </p>
                  {property.location && <MapLink location={property.location} country={property.country} />}
                </section>

                <HostCard />
              </div>

              <aside className="lg:col-span-5 xl:col-span-4" id="enquire">
                <div className="lg:sticky lg:top-28 rounded-[24px] border border-loc-night/10 bg-white p-6 md:p-8 shadow-[0_24px_60px_-30px_rgba(35,27,21,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-loc-stone">{t("startingFrom")}</p>
                  <p className="mt-1 font-heading text-3xl font-semibold tracking-tight text-loc-night">{price}</p>
                  <div className="my-6 h-px bg-loc-night/10" />
                  <p className="font-heading text-xl font-semibold text-loc-night mb-1">{t("enquireTitle")}</p>
                  <p className="text-loc-stone text-sm mb-5">{t("enquireBody")}</p>
                  <div className="mb-6">
                    <TrustStrip />
                  </div>
                  <InquiryForm subject={`Inquiry about stay: ${property.title}`} />
                </div>
              </aside>
            </div>

            <MobileEnquireBar
              price={<><span className="block text-[11px] uppercase tracking-[0.14em] text-loc-stone">{t("startingFrom")}</span><span className="font-semibold">{price}</span></>}
              cta={tCommon("inquire")}
            />
          </>
        ) : (
          <div className="mt-10 space-y-4">
            <div className="h-12 w-2/3 bg-loc-night/[0.06] rounded animate-pulse" />
            <div className="h-[420px] bg-loc-night/[0.06] rounded-[24px] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
