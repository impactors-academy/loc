import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

type Variant = "primary" | "light" | "ghost-light" | "dark" | "outline"

// Finishes live in globals.css (.btn-*, .glass-*) so every rounded control on
// the site shares one set of highlights and shadows.
const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  light: "btn-light",
  "ghost-light": "glass-dark",
  dark: "btn-dark",
  outline: "glass-light",
}

interface Props extends Omit<ComponentProps<typeof Link>, "children" | "className"> {
  children: ReactNode
  variant?: Variant
  size?: "md" | "lg"
  arrow?: boolean
  className?: string
}

export function ButtonLink({ children, variant = "primary", size = "md", arrow = false, className, ...props }: Props) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-copper focus-visible:ring-offset-2",
        size === "lg" ? "px-7 py-4 text-[15px]" : "px-5 py-3 text-sm",
        VARIANTS[variant],
        className
      )}
    >
      <span className="flip-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {arrow && (
        <ArrowUpRight
          size={size === "lg" ? 18 : 16}
          className="transition-transform duration-300 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
