import { FaqSection, type FaqItem } from "@/components/shared/FaqSection"
import { ButtonLink } from "@/components/shared/ButtonLink"
import { PageHeader } from "@/components/shared/PageHeader"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("aboutPage")
  return {
    title: `${t("title")} | LOC`,
    description: t("metaDescription"),
    alternates: { canonical: "/about" },
  }
}

export default async function AboutPage() {
  const t = await getTranslations("aboutPage")
  const tf = await getTranslations("aboutFaq")
  const faq = tf.raw("items") as FaqItem[]

  const blocks = [
    { title: t("howItWorksTitle"), body: t("howItWorksBody") },
    { title: t("discoveryTitle"), body: t("discoveryBody") },
  ]

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4 border-t border-loc-night/10 pt-10">
          {blocks.map((b) => (
            <div key={b.title} className="rounded-[24px] bg-white border border-loc-night/[0.06] p-8">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-loc-night mb-3">{b.title}</h2>
              <p className="text-loc-stone leading-relaxed">{b.body}</p>
            </div>
          ))}
          <div className="rounded-[24px] bg-loc-night text-white p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight mb-3">{t("partOfTitle")}</h2>
            <p className="text-white/70 leading-relaxed">
              {t.rich("partOfBody", {
                link: (chunks) => (
                  <a href="https://impactorsacademy.com" target="_blank" rel="noopener noreferrer" className="text-loc-copper underline underline-offset-4">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        eyebrow={tf("eyebrow")}
        title={tf("title")}
        items={faq}
        aside={
          <ButtonLink href="/contact" variant="outline" arrow>
            {t("getInTouch")}
          </ButtonLink>
        }
      />
    </>
  )
}
