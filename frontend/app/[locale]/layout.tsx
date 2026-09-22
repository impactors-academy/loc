import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Providers } from "../providers"
import type { Metadata } from "next"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : `${locale}_${locale.toUpperCase()}`,
      url: "https://loctravels.com",
      siteName: "LOC",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/images/hero.jpg",
          width: 1280,
          height: 720,
          alt: "LOC | Discover the World",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/hero.jpg"],
      creator: "@loctravels",
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  )
}
