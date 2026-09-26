import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Compass } from "lucide-react"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <main className="min-h-screen bg-loc-sand/20 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-loc-sand flex items-center justify-center mx-auto mb-7">
        <Compass size={28} strokeWidth={1.5} className="text-loc-terracotta" aria-hidden="true" />
      </div>

      <p className="font-sans text-loc-terracotta text-xs font-semibold uppercase tracking-[0.2em] mb-4">
        404
      </p>

      <h1 className="font-heading text-3xl md:text-4xl font-semibold text-loc-night text-balance mb-4 max-w-sm">
        {t("title")}
      </h1>

      <p className="font-sans text-loc-stone text-base leading-relaxed max-w-sm mb-10">
        {t("body")}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center px-7 py-3 rounded-full bg-loc-terracotta text-white text-sm font-semibold hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-md shadow-loc-terracotta/20"
        >
          {t("cta")}
        </Link>
        <Link
          href="/experiences"
          className="inline-flex items-center px-7 py-3 rounded-full border border-loc-stone/30 text-loc-stone text-sm font-medium hover:border-loc-terracotta hover:text-loc-terracotta transition-colors"
        >
          {t("ctaSecondary")}
        </Link>
      </div>
    </main>
  )
}
