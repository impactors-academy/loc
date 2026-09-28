import { ButtonLink } from "@/components/shared/ButtonLink"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

// The one number on the page, and it is a product rule rather than a metric:
// LOC takes no cut of any booking. Nothing here is counted or estimated.
export async function ZeroCommission() {
  const t = await getTranslations("home")
  const th = await getTranslations("homepage")
  const points = t.raw("zeroPoints") as string[]

  return (
    <section className="relative overflow-hidden bg-loc-sand py-24 md:py-32" aria-labelledby="zero-title">
      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
        <ScrollReveal className="lg:col-span-6">
          <p
            className="font-heading font-semibold text-loc-terracotta tracking-[-0.06em] leading-[0.8] tabular-nums"
            style={{ fontSize: "clamp(9rem, 26vw, 22rem)" }}
            aria-hidden="true"
          >
            0%
          </p>
          <p className="mt-6 text-loc-night font-semibold uppercase tracking-[0.2em] text-xs">{th("commissionLabel")}</p>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delay={0.1}>
          <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-terracotta mb-4">
            <span className="h-px w-8 bg-loc-terracotta/50" aria-hidden="true" />
            {t("zeroEyebrow")}
          </p>
          <h2 id="zero-title" className="font-heading text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[0.95] text-loc-night text-balance">
            {t("zeroTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-loc-night/75 max-w-xl text-pretty">{t("zeroBody")}</p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-loc-night">
                <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-loc-terracotta text-white flex items-center justify-center" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/about" variant="dark" size="lg" arrow>
              {t("zeroCta")}
            </ButtonLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
