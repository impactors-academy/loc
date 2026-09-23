import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export async function IntentSplit() {
  const t = await getTranslations("homepage")

  return (
    <section className="bg-white border-b border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">

          {/* Traveller */}
          <Link
            href="/experiences"
            className="group flex items-start gap-5 px-4 py-8 sm:px-8 hover:bg-loc-sand/30 transition-colors"
          >
            <span className="text-3xl mt-0.5 shrink-0" aria-hidden="true">✈️</span>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-lg font-semibold text-loc-night group-hover:text-loc-terracotta transition-colors mb-1">
                {t("intentTraveller")}
              </p>
              <p className="font-sans text-sm text-loc-stone leading-relaxed mb-3">
                {t("intentTravellerDesc")}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-loc-terracotta uppercase tracking-wide">
                {t("intentTravellerCta")} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          {/* Provider */}
          <Link
            href="/promote"
            className="group flex items-start gap-5 px-4 py-8 sm:px-8 hover:bg-loc-sand/30 transition-colors"
          >
            <span className="text-3xl mt-0.5 shrink-0" aria-hidden="true">🏠</span>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-lg font-semibold text-loc-night group-hover:text-loc-terracotta transition-colors mb-1">
                {t("intentProvider")}
              </p>
              <p className="font-sans text-sm text-loc-stone leading-relaxed mb-3">
                {t("intentProviderDesc")}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-loc-terracotta uppercase tracking-wide">
                {t("intentProviderCta")} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
