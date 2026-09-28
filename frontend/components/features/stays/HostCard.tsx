"use client"

import { UserRound, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"

// Deliberately doesn't render the raw owner_contact value — that field
// exists so the backend can notify the owner on inquiry (STAY-4), not to be
// published on the page where it'd get scraped. Matches how LOC actually
// works: message through the form, no direct contact info handed out.
export function HostCard() {
  const t = useTranslations("stayDetailPage")
  return (
    <section className="py-10">
      <div className="flex items-center gap-4 rounded-[20px] bg-loc-sand/60 p-6">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
          <UserRound className="w-6 h-6 text-loc-terracotta" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading font-semibold text-loc-night text-lg">{t("hostedDirectly")}</p>
          <p className="text-loc-stone text-sm flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            {t("messageThroughForm")}
          </p>
        </div>
      </div>
    </section>
  )
}
