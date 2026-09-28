import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getTranslations } from "next-intl/server"

interface Step {
  title: string
  desc: string
}

export async function HowItWorks() {
  const t = await getTranslations("howItWorks")
  const steps = t.raw("steps") as Step[]

  return (
    <section className="bg-loc-night py-24 md:py-32">
      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <ScrollReveal>
              <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} dark />
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal variant="stagger" className="lg:col-span-7 border-t border-white/10">
          {steps.map((step, i) => (
            <ScrollRevealItem key={step.title}>
              <div className="group grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-10 md:py-12 border-b border-white/10">
                <span
                  className="font-heading font-semibold text-loc-copper/90 tabular-nums leading-none tracking-[-0.04em] text-5xl md:text-7xl"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1">
                  <h3 className="font-heading text-2xl md:text-3xl font-semibold text-white tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-white/60 text-base md:text-lg leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
