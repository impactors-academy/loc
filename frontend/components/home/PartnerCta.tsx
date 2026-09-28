import { ButtonLink } from "@/components/shared/ButtonLink"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import { EDITORIAL_IMAGES, unsplash } from "@/lib/images"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

export async function PartnerCta() {
  const t = await getTranslations("partnerCta")
  const th = await getTranslations("home")

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="relative isolate overflow-hidden rounded-[28px] bg-loc-slate grid lg:grid-cols-2 min-h-[520px]">
          <div className="relative min-h-[280px] lg:min-h-full order-1 lg:order-2">
            <Image
              src={unsplash(EDITORIAL_IMAGES.kasbah, 1400)}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-loc-slate via-loc-slate/30 to-transparent" aria-hidden="true" />
          </div>
          <div className="relative order-2 lg:order-1 p-8 md:p-14 flex flex-col justify-center">
            <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-amber mb-5">
              <span className="h-px w-8 bg-loc-amber/60" aria-hidden="true" />
              {t("eyebrow")}
            </p>
            <h2 className="font-heading text-4xl md:text-6xl font-semibold text-white tracking-[-0.02em] leading-[0.95] text-balance">
              {t("title")}
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-lg text-pretty">{t("subtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/promote" variant="light" size="lg" arrow>
                {t("cta")}
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost-light" size="lg">
                {th("partnerSecondary")}
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
