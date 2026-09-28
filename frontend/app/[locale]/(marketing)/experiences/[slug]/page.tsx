import { JsonLd } from "@/components/shared/JsonLd"
import { AffiliateLinks } from "@/components/features/affiliates/AffiliateLinks"
import { InquiryForm } from "@/components/shared/InquiryForm"
import { TrustStrip } from "@/components/shared/TrustStrip"
import { ReferralButton } from "@/components/features/experiences/ReferralButton"
import { PropertyGallery } from "@/components/features/stays/PropertyGallery"
import { Breadcrumbs, Fact, MobileEnquireBar } from "@/components/shared/DetailParts"
import { getPoolImage } from "@/lib/images"
import { api } from "@/lib/api"
import { formatAmount } from "@/lib/types"
import { Clock, Globe, MapPin, Tag, User } from "lucide-react"
import { splitTitle, tidyDashes } from "@/lib/text"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const exp = await api.experiences.get(slug)
    const title = `${tidyDashes(exp.title.replace(/\s+\|\s+/g, " — "))} | LOC Experiences`
    const image = exp.images?.[0]
    return {
      title,
      description: exp.description,
      alternates: { canonical: `/experiences/${slug}` },
      openGraph: {
        title,
        description: exp.description,
        url: `/experiences/${slug}`,
        type: "website",
        ...(image ? { images: [{ url: image, alt: exp.title }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: exp.description,
        ...(image ? { images: [image] } : {}),
      },
    }
  } catch {
    return { title: "Experience | LOC" }
  }
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params
  const t = await getTranslations("experienceDetailPage")
  const tCommon = await getTranslations("common")
  const tNav = await getTranslations("nav")

  let experience: Awaited<ReturnType<typeof api.experiences.get>> | null = null
  try {
    experience = await api.experiences.get(slug)
  } catch {
    // render skeleton / not-found fallback below
  }

  const jsonLd = experience
    ? {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        name: experience.title,
        description: experience.description,
        url: `https://loctravels.com/experiences/${slug}`,
        ...(experience.images?.length ? { image: experience.images } : {}),
        ...(experience.location
          ? {
              address: {
                "@type": "PostalAddress",
                addressLocality: experience.location,
                ...(experience.country ? { addressCountry: experience.country } : {}),
              },
            }
          : {}),
        ...(experience.priceMin != null
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: experience.currency,
                price: experience.priceMin,
                url: `https://loctravels.com/experiences/${slug}`,
              },
            }
          : {}),
      }
    : null

  const tCat = await getTranslations("experienceCategories")
  const categoryLabel = experience ? (tCat.has(experience.category) ? tCat(experience.category) : experience.category) : ""
  const images = experience
    ? experience.images?.length
      ? experience.images
      : [getPoolImage(experience.category, experience.slug, 1800)]
    : []
  const price =
    experience?.priceMin != null ? `${formatAmount(experience.priceMin, experience.currency)} ${tCommon("perPerson")}` : null

  return (
    <div className="pt-28 md:pt-32 pb-28 lg:pb-32">
      {jsonLd && (
        <JsonLd data={jsonLd} />
      )}

      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: t("breadcrumbHome"), href: "/" },
            { label: tNav("experiences"), href: "/experiences" },
            { label: experience ? splitTitle(experience.title).name : slug },
          ]}
        />

        {experience ? (
          <>
            <div className="mt-6 mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div className="max-w-4xl">
                <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-terracotta mb-4">
                  <span className="h-px w-8 bg-loc-terracotta" aria-hidden="true" />
                  {categoryLabel}
                </p>
                <h1 className="font-heading text-4xl md:text-6xl font-semibold text-loc-night tracking-[-0.03em] leading-[0.95] text-balance">
                  {splitTitle(experience.title).name}
                </h1>
                {splitTitle(experience.title).detail && (
                  <p className="mt-3 font-heading text-xl md:text-2xl text-loc-stone tracking-tight">{splitTitle(experience.title).detail}</p>
                )}
              </div>
              <p className="flex items-center gap-2 text-loc-stone shrink-0">
                <MapPin size={16} className="text-loc-terracotta" aria-hidden="true" />
                {experience.location}
              </p>
            </div>

            <PropertyGallery
              images={images}
              title={tidyDashes(experience.title)}
              showAllLabel={tCommon("showAllPhotos", { count: images.length })}
            />

            <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-7 xl:col-span-8">
                <section className="pb-10 border-b border-loc-night/10">
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-loc-night mb-5">{t("aboutTitle")}</h2>
                  <p className="text-loc-night/80 text-lg leading-relaxed whitespace-pre-line text-pretty">{tidyDashes(experience.description)}</p>
                </section>

                <section className="py-10 border-b border-loc-night/10 grid sm:grid-cols-2 gap-6">
                  <Fact icon={<Tag size={18} />} label={tCommon("categoryLabel")} value={categoryLabel} />
                  {experience.duration && <Fact icon={<Clock size={18} />} label={t("durationLabel")} value={experience.duration} />}
                  <Fact icon={<MapPin size={18} />} label={tCommon("locationLabel")} value={experience.location} />
                  {experience.country && <Fact icon={<Globe size={18} />} label={tCommon("countryLabel")} value={experience.country} />}
                </section>

                {experience.providerName && (
                  <section className="py-10">
                    <div className="flex items-center gap-4 rounded-[20px] bg-loc-sand/60 p-6">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-loc-terracotta" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-loc-night text-lg">{t("runBy", { name: experience.providerName })}</p>
                        <p className="text-loc-stone text-sm mt-1">{t("interestedBody")}</p>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-5 xl:col-span-4" id="enquire">
                <div className="lg:sticky lg:top-28 rounded-[24px] border border-loc-night/10 bg-white p-6 md:p-8 shadow-[0_24px_60px_-30px_rgba(35,27,21,0.35)]">
                  {price && (
                    <>
                      <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-loc-stone">{t("startingFrom")}</p>
                      <p className="mt-1 font-heading text-3xl font-semibold tracking-tight text-loc-night">{price}</p>
                      <div className="my-6 h-px bg-loc-night/10" />
                    </>
                  )}
                  {experience.referralUrl && (
                    <div className="mb-6">
                      <ReferralButton slug={slug} referralUrl={experience.referralUrl} />
                      <p className="text-center text-xs text-loc-stone mt-2">{t("opensProviderPage")}</p>
                    </div>
                  )}
                  <p className="font-heading text-xl font-semibold text-loc-night mb-1">{t("interestedTitle")}</p>
                  <p className="text-loc-stone text-sm mb-5">{t("interestedBody")}</p>
                  <div className="mb-6">
                    <TrustStrip />
                  </div>
                  <InquiryForm subject={`Inquiry about experience: ${experience.title}`} />
                  {experience.country && (
                    <div className="mt-6">
                      <AffiliateLinks country={experience.country} heading={t("planYourTrip")} />
                    </div>
                  )}
                </div>
              </aside>
            </div>

            <MobileEnquireBar
              price={
                price ? (
                  <>
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-loc-stone">{t("startingFrom")}</span>
                    <span className="font-semibold">{price}</span>
                  </>
                ) : (
                  <span className="font-semibold">{experience.title}</span>
                )
              }
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
