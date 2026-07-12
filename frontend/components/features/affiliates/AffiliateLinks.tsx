import { getAffiliates } from "@/lib/affiliates"
import { Car, ExternalLink, Plane, Shield } from "lucide-react"

const ICON: Record<string, React.ElementType> = {
  flights: Plane,
  insurance: Shield,
  cars: Car,
}

interface Props {
  country?: string
  heading?: string
}

export function AffiliateLinks({ country, heading = "Plan your trip" }: Props) {
  const links = getAffiliates(country)

  return (
    <div className="rounded-2xl border border-border bg-loc-sand/40 p-5">
      <p className="font-heading text-sm font-semibold text-loc-night mb-4">{heading}</p>
      <div className="space-y-2.5">
        {links.map((link) => {
          const Icon = ICON[link.category] ?? ExternalLink
          return (
            <a
              key={link.category}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border hover:border-loc-terracotta/40 hover:shadow-sm transition-all group"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-loc-sand text-loc-terracotta">
                <Icon className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-loc-night group-hover:text-loc-terracotta transition-colors leading-tight">
                  {link.label}
                </p>
                <p className="text-xs text-loc-stone truncate">{link.description}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-loc-stone/50 flex-shrink-0" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
