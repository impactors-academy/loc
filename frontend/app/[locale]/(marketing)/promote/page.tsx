import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

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

const WHY_LOC_ICONS = ["🎯", "🤝", "📍"] as const

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
  const whyLoc = WHY_LOC_ICONS.map((icon, i) => ({ icon, ...whyLocCopy[i] }))

  return (
    <main className="pt-24 pb-20">
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
      <section className="bg-loc-sand/30 py-14 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyLoc.map((item) => (
              <div key={item.title} className="text-center px-4">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-heading text-lg font-semibold text-loc-night mb-2">{item.title}</h3>
                <p className="text-loc-stone text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
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

      {/* Inquiry */}
      <section className="container mx-auto px-4 max-w-2xl">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm">
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
    </main>
  )
}
