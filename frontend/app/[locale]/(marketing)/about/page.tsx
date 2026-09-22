import { SectionHeader } from "@/components/shared/SectionHeader"
import { Link } from "@/i18n/navigation"
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

  return (
    <main className="pt-24 pb-20">
      <section className="container mx-auto px-4 text-center max-w-2xl mb-16">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          center
        />
      </section>

      <section className="container mx-auto px-4 max-w-2xl mb-10">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm space-y-6">
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              {t("howItWorksBody")}
            </p>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              {t("discoveryTitle")}
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              {t("discoveryBody")}
            </p>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              {t("partOfTitle")}
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              {t.rich("partOfBody", {
                link: (chunks) => (
                  <a
                    href="https://impactorsacademy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-loc-terracotta"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-2xl text-center">
        <Link href="/contact" className="text-loc-terracotta text-sm font-medium hover:underline">
          {t("getInTouch")} →
        </Link>
      </section>
    </main>
  )
}
