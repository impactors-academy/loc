"use client"

import { api } from "@/lib/api"
import { ExternalLink } from "lucide-react"

interface Props {
  slug: string
  referralUrl: string | null
}

export function ReferralButton({ slug, referralUrl }: Props) {
  if (!referralUrl) return null

  const handleClick = () => {
    // fire-and-forget — never block the navigation
    api.referrals.click(slug).catch(() => undefined)
    window.open(referralUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-loc-terracotta text-white font-semibold rounded-xl hover:bg-loc-terracotta/90 transition-colors text-sm"
    >
      Book with provider
      <ExternalLink className="w-4 h-4" />
    </button>
  )
}
