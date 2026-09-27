import { EDITORIAL_IMAGES, unsplash } from "@/lib/images"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"

interface Props {
  badge: string
  title: string
  body: string
  icon?: LucideIcon
  actions?: ReactNode
  className?: string
}

// Shown wherever a section has no live listings yet. It says plainly that the
// thing is on its way instead of showing an empty grid or a placeholder listing.
export function ComingSoon({ badge, title, body, icon: Icon, actions, className }: Props) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-[28px] bg-loc-night px-6 py-16 md:px-16 md:py-24", className)}>
      <Image
        src={unsplash(EDITORIAL_IMAGES.zellige, 1600)}
        alt=""
        fill
        className="-z-10 object-cover opacity-30"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-loc-night via-loc-night/90 to-loc-night/40" aria-hidden="true" />
      <div className="max-w-2xl">
        <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
          {Icon && <Icon size={14} className="text-loc-amber" aria-hidden="true" />}
          {badge}
        </span>
        <h2 className="mt-6 font-heading text-4xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-[0.95] text-balance">
          {title}
        </h2>
        <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-xl text-pretty">{body}</p>
        {actions && <div className="mt-10 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  )
}
