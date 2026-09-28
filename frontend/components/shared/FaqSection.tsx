import { JsonLd } from "@/components/shared/JsonLd"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import type { ReactNode } from "react"

export interface FaqItem {
  q: string
  a: string
}

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  items: FaqItem[]
  aside?: ReactNode
  className?: string
}

// Native <details> accordion: keyboard and screen-reader support for free, no
// client JavaScript, and the answers stay in the HTML for crawlers. The same
// items are emitted as FAQPage data. Each page gets its own question set so
// no two pages carry the same FAQ markup.
export function FaqSection({ eyebrow, title, subtitle, items, aside, className }: Props) {
  if (items.length === 0) return null
  return (
    <section className={cn("py-24 md:py-32", className)}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {aside}
        </div>
        <div className="lg:col-span-7 border-t border-loc-night/10">
          {items.map(({ q, a }) => (
            <details key={q} className="group border-b border-loc-night/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-heading text-xl md:text-2xl font-semibold tracking-tight text-loc-night [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta rounded-sm">
                {q}
                <span className="glass-light h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 ease-expo group-open:rotate-45" aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <p className="pb-6 pr-14 text-loc-stone text-base md:text-lg leading-relaxed text-pretty">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
