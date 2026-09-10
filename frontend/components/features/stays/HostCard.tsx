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
    <div className="border-t border-border pt-6 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-loc-sand flex items-center justify-center shrink-0">
          <UserRound className="w-6 h-6 text-loc-terracotta" />
        </div>
        <div>
          <p className="font-heading font-semibold text-loc-night text-sm">{t("hostedDirectly")}</p>
          <p className="text-loc-stone text-xs flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t("messageThroughForm")}
          </p>
        </div>
      </div>
    </div>
  )
}
