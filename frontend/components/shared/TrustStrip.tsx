import { getTranslations } from "next-intl/server"

export async function TrustStrip() {
  const t = await getTranslations("trustStrip")

  const items = [
    { icon: "→", label: t("directContact") },
    { icon: "◷", label: t("responseTime") },
    { icon: "◇", label: t("noFee") },
  ]

  return (
    <ul className="space-y-2 mb-5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5 text-xs text-loc-stone">
          <span className="text-loc-terracotta font-semibold shrink-0" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  )
}
