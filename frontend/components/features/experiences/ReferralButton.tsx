"use client"

import { api } from "@/lib/api"
import { trackEvent } from "@/lib/analytics"
import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"

interface Props {
  slug: string
  referralUrl: string | null
}

export function ReferralButton({ slug, referralUrl }: Props) {
  const t = useTranslations("experienceDetailPage")
  if (!referralUrl) return null

  const handleClick = () => {
    // fire-and-forget. never block the navigation
    api.referrals.click(slug).catch(() => undefined)
    trackEvent("Referral Click", { slug })
    window.open(referralUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleClick}
      className="btn-dark w-full h-14 flex items-center justify-center gap-2 px-5 font-semibold rounded-full text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-copper focus-visible:ring-offset-2"
    >
      {t("bookWithProvider")}
      <ExternalLink className="w-4 h-4" />
    </button>
  )
}
