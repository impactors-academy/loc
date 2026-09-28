import { ComingSoon } from "@/components/shared/ComingSoon"
import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Check, Target, Coins, MapPinned, Package } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import type { LucideIcon } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("promotePage")
  return {
    title: `${t("metaTitle")} | LOC`,
    description: t("metaDescription"),
    alternates: { canonical: "/promote" },
  }
}

// Prices/periods/highlight flags are data, not copy — kept here rather than
// in messages/*.json. Names, descriptions, and features are translated via
// promotePage.packages in each locale (same order, same length).
const PACKAGE_META = [
  { price: "€149", period: "/ month", highlight: false },
  { price: "€349", period: "/ month", highlight: true },
  { price: "€599", period: "/ month", highlight: false },
] as const

// Partner packages are being reworked (pricing and what each tier includes).
// The current version is kept below, untouched, so it can be switched back on
// by flipping this to true once the new packaging is agreed. Until then the
// section says "coming soon" and routes businesses to the enquiry form.
const PACKAGES_LIVE = false

const WHY_LOC_ICONS: LucideIcon[] = [Target, Coins, MapPinned]

interface PackageCopy {
  name: string
  description: string
  features: string[]
  cta: string
}

interface WhyLocCopy {
  title: string
  desc: string
}

export default async function PromotePage() {
  const t = await getTranslations("promotePage")
  const packagesCopy = t.raw("packages") as PackageCopy[]
  const whyLocCopy = t.raw("whyLoc") as WhyLocCopy[]
  const packages = PACKAGE_META.map((meta, i) => ({ ...meta, ...packagesCopy[i] }))
  const whyLoc = WHY_LOC_ICONS.map((Icon, i) => ({ Icon, ...whyLocCopy[i] }))

  const tCommon = await getTranslations("common")

  return (
    <div className="pt-28 md:pt-32 pb-24">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center max-w-2xl mb-16">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          center
        />
      </section>

      {/* Why LOC */}
      <section className="bg-loc-cream py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyLoc.map((item) => (
              <div key={item.title} className="text-center px-4">
                <div className="glass-light w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.Icon size={26} strokeWidth={1.5} className="text-loc-terracotta" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-loc-night mb-2">{item.title}</h3>
                <p className="text-loc-stone text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!PACKAGES_LIVE && (
        <section className="container mx-auto px-4 mb-20">
          <ComingSoon
            badge={tCommon("comingSoon")}
            icon={Package}
            title={t("packagesSoonTitle")}
            body={t("packagesSoonBody")}
            actions={
              <a href="#promote-enquire" className="btn-light inline-flex items-center rounded-full px-7 py-4 text-[15px] font-semibold">
                {t("packagesSoonCta")}
              </a>
            }
          />
        </section>
      )}

      {/* Packages */}
      {PACKAGES_LIVE && (
      <section className="container mx-auto px-4 mb-20">
        <SectionHeader
          eyebrow={t("pricingEyebrow")}
          title={t("pricingTitle")}
          subtitle={t("pricingSubtitle")}
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                pkg.highlight
                  ? "border-loc-terracotta bg-loc-terracotta text-white shadow-xl scale-[1.02]"
                  : "border-border bg-white"
              }`}
            >
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-loc-amber text-loc-night text-xs font-semibold px-4 py-1 rounded-full">
                  {t("mostPopular")}
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${pkg.highlight ? "text-white/70" : "text-loc-terracotta"}`}>
                {pkg.name}
              </p>
              <div className="flex items-end gap-1 mb-3">
                <span className={`font-heading text-4xl font-semibold ${pkg.highlight ? "text-white" : "text-loc-night"}`}>
                  {pkg.price}
                </span>
                <span className={`text-sm mb-1 ${pkg.highlight ? "text-white/70" : "text-loc-stone"}`}>
                  {pkg.period}
                </span>
              </div>
              <p className={`text-sm mb-6 ${pkg.highlight ? "text-white/80" : "text-loc-stone"}`}>
                {pkg.description}
              </p>
              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={15} className={`mt-0.5 shrink-0 ${pkg.highlight ? "text-white/80" : "text-loc-terracotta"}`} />
                    <span className={pkg.highlight ? "text-white/90" : "text-loc-stone"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Inquiry */}
      <section id="promote-enquire" className="container mx-auto px-4 max-w-2xl scroll-mt-28">
        <div className="rounded-[24px] bg-white border border-loc-night/10 p-8 md:p-10 shadow-[0_24px_60px_-30px_rgba(35,27,21,0.35)]">
          <SectionHeader
            eyebrow={t("inquiryEyebrow")}
            title={t("inquiryTitle")}
            subtitle={t("inquirySubtitle")}
          />
          <div className="mt-8">
            <InquiryForm subject="Business promotion inquiry" />
          </div>
        </div>
      </section>
    </div>
  )
}
