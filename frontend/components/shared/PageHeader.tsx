import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
}

// Listing-page masthead: oversized title left, supporting line right, the same
// split the sibling IA Pro pages use for their section openers.
export function PageHeader({ eyebrow, title, subtitle, children, className }: Props) {
  return (
    <header className={cn("container mx-auto px-4 pt-32 md:pt-40 pb-10 md:pb-14", className)}>
      {eyebrow && (
        <p className="inline-flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] font-semibold text-loc-terracotta mb-5">
          <span className="h-px w-8 bg-loc-terracotta" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h1
          className="lg:col-span-7 font-heading font-semibold text-loc-night tracking-[-0.04em] leading-[0.88]"
          // Short titles ("Stays") carry the full display size; longer ones step
          // down so they hold two lines instead of four.
          style={{ fontSize: title.length > 14 ? "clamp(2.75rem, 6vw, 5.75rem)" : "clamp(3.25rem, 9vw, 8.5rem)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="lg:col-span-5 lg:pb-3 text-loc-stone text-base md:text-lg leading-relaxed max-w-md lg:ml-auto text-pretty">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </header>
  )
}
