import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ChipProps {
  active: boolean
  onClick: () => void
  icon?: LucideIcon
  children: React.ReactNode
}

export function FilterChip({ active, onClick, icon: Icon, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 inline-flex items-center gap-2 h-11 px-4 rounded-full text-sm font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta focus-visible:ring-offset-2",
        active ? "btn-dark" : "glass-light"
      )}
    >
      {Icon && <Icon size={16} strokeWidth={1.75} className={active ? "text-loc-copper" : "text-loc-terracotta"} aria-hidden="true" />}
      {children}
    </button>
  )
}

interface SegmentProps {
  label: string
  options: { value: string; label: string; soon?: string }[]
  value: string
  onChange: (value: string) => void
}

// Country picker as a segmented control: few enough options to show them all,
// and one tap instead of opening a menu.
export function Segmented({ label, options, value, onChange }: SegmentProps) {
  return (
    <div role="group" aria-label={label} className="glass-light inline-flex shrink-0 rounded-full p-1">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value || "all"}
            type="button"
            aria-pressed={active}
            disabled={Boolean(opt.soon)}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta",
              active ? "btn-dark" : "text-loc-stone hover:text-loc-night",
              opt.soon && "cursor-default text-loc-stone/60 hover:text-loc-stone/60"
            )}
          >
            {opt.label}
            {opt.soon && (
              <span className="rounded-full bg-loc-sand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-loc-terracotta">
                {opt.soon}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
