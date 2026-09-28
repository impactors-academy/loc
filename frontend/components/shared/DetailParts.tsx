import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-loc-stone">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={13} className="shrink-0 text-loc-stone/60" aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-loc-night transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-loc-night truncate max-w-[40ch]" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-loc-sand flex items-center justify-center text-loc-terracotta" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-loc-stone">{label}</p>
        <p className="mt-0.5 text-[15px] text-loc-night">{value}</p>
      </div>
    </div>
  )
}

// Phones never see the sticky sidebar, so the price and the way to act on it
// ride along at the bottom of the screen instead.
export function MobileEnquireBar({ price, cta }: { price: ReactNode; cta: string }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-loc-night/10 bg-loc-cream/95 backdrop-blur-xl px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
      <div className="min-w-0 text-sm text-loc-night">{price}</div>
      <a
        href="#enquire"
        className="btn-primary shrink-0 inline-flex items-center justify-center h-12 px-6 rounded-full text-[15px] font-semibold"
      >
        {cta}
      </a>
    </div>
  )
}
