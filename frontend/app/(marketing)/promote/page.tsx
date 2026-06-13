import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Check } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Promote Your Business in Morocco | LOC",
  description:
    "Reach thousands of active travelers through LOC's platform. Featured placements, social media content, and full marketing packages for Morocco tourism businesses.",
  alternates: { canonical: "/promote" },
}

const PACKAGES = [
  {
    name: "Visibility",
    price: "€149",
    period: "/ month",
    description: "Get your listing in front of travelers actively searching.",
    features: [
      "Featured badge on listing card",
      "Priority placement in search results",
      "Listed in the 'Handpicked' homepage section",
      "Monthly performance report",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Content",
    price: "€349",
    period: "/ month",
    description: "Let our team create content that drives real bookings.",
    features: [
      "Everything in Visibility",
      "2× short-form video (Reels/TikTok ready)",
      "4× curated social posts per month",
      "Dedicated blog feature article",
      "Branded photography session (on request)",
    ],
    cta: "Most popular",
    highlight: true,
  },
  {
    name: "Growth",
    price: "€599",
    period: "/ month",
    description: "Full-stack marketing for serious tourism businesses.",
    features: [
      "Everything in Content",
      "Premium listing tier (top of all results)",
      "Monthly strategy call with the LOC team",
      "Custom landing page on loctravels.com",
      "Priority lead routing to your inbox",
      "Quarterly analytics report",
    ],
    cta: "Let's talk",
    highlight: false,
  },
]

const WHY_LOC = [
  {
    icon: "🎯",
    title: "High-intent audience",
    desc: "Visitors come to LOC specifically to find experiences and stays — not to scroll. Your listing reaches people ready to book.",
  },
  {
    icon: "🤝",
    title: "No commission on bookings",
    desc: "We charge flat placement fees, not a percentage of every booking. More revenue stays with you.",
  },
  {
    icon: "📍",
    title: "Local credibility",
    desc: "LOC is built by people who live in Morocco. Our audience trusts our recommendations — and your listing inherits that trust.",
  },
]

export default function PromotePage() {
  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="container mx-auto px-4 text-center max-w-2xl mb-16">
        <SectionHeader
          eyebrow="For Businesses"
          title="Grow with LOC"
          subtitle="Connect your experience or property with thousands of travelers actively searching for what Morocco has to offer."
          center
        />
      </section>

      {/* Why LOC */}
      <section className="bg-loc-sand/30 py-14 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_LOC.map((item) => (
              <div key={item.title} className="text-center px-4">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-heading text-lg font-bold text-loc-night mb-2">{item.title}</h3>
                <p className="text-loc-stone text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="container mx-auto px-4 mb-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Choose your package"
          subtitle="Flat monthly fees. No booking commissions. Cancel any time."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                pkg.highlight
                  ? "border-loc-terracotta bg-loc-terracotta text-white shadow-xl scale-[1.02]"
                  : "border-border bg-white"
              }`}
            >
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-loc-amber text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most popular
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${pkg.highlight ? "text-white/70" : "text-loc-terracotta"}`}>
                {pkg.name}
              </p>
              <div className="flex items-end gap-1 mb-3">
                <span className={`font-heading text-4xl font-bold ${pkg.highlight ? "text-white" : "text-loc-night"}`}>
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
            eyebrow="Get in touch"
            title="Ready to grow your business?"
            subtitle="Tell us about your business and the package you're interested in. We'll get back to you within 24 hours."
          />
          <div className="mt-8">
            <InquiryForm subject="Business promotion inquiry" />
          </div>
        </div>
      </section>
    </main>
  )
}
