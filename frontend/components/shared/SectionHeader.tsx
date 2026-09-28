import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  center?: boolean
  dark?: boolean
  as?: "h1" | "h2"
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  center = false,
  dark = false,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", center && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "inline-flex items-center gap-3 font-sans uppercase tracking-[0.22em] text-[11px] font-semibold mb-4",
            dark ? "text-loc-copper" : "text-loc-terracotta"
          )}
        >
          <span className={cn("h-px w-8", dark ? "bg-loc-copper" : "bg-loc-terracotta")} aria-hidden="true" />
          {eyebrow}
          {center && <span className={cn("h-px w-8", dark ? "bg-loc-copper" : "bg-loc-terracotta")} aria-hidden="true" />}
        </p>
      )}
      <Heading
        className={cn(
          "font-heading font-semibold tracking-[-0.02em] leading-[0.95] text-balance",
          Heading === "h1" ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl",
          dark ? "text-white" : "text-loc-night"
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg leading-relaxed max-w-2xl text-pretty",
            dark ? "text-white/65" : "text-loc-stone",
            center && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
