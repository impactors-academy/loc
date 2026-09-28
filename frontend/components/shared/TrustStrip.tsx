import { Clock, MessageCircle, ShieldCheck } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function TrustStrip() {
  const t = await getTranslations("trustStrip")

  const items = [
    { icon: MessageCircle, label: t("directContact") },
    { icon: Clock, label: t("responseTime") },
    { icon: ShieldCheck, label: t("noFee") },
  ]

  return (
    <ul className="space-y-2.5">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3 text-sm text-loc-night/80">
          <Icon size={16} strokeWidth={1.75} className="text-loc-terracotta shrink-0" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}
