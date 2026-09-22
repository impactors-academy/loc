import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  center?: boolean
}

export function SectionHeader({ title, subtitle, eyebrow, center = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", center && "text-center")}>
      {eyebrow && (
        <p className="font-sans text-loc-terracotta uppercase tracking-[0.25em] text-[10px] font-semibold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-none text-loc-night text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-loc-stone mt-3 text-base leading-relaxed max-w-2xl", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
