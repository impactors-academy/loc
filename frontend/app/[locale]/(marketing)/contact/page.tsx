import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage")
  return {
    title: `${t("title")} | LOC`,
    description: t("metaDescription"),
    alternates: { canonical: "/contact" },
  }
}

export default async function ContactPage() {
  const t = await getTranslations("contactPage")

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

      <section className="container mx-auto px-4 max-w-2xl">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm">
          <InquiryForm subject="General contact" />
        </div>
      </section>
    </main>
  )
}
