import { cn } from "@/lib/utils"
import { Fragment } from "react"

interface Props {
  items: string[]
  className?: string
  duration?: number
}

// The item list is rendered twice end to end and the track slides by -50%, so
// the second copy lands exactly where the first began. The duplicate is hidden
// from assistive tech; the first copy carries the content once.
export function Marquee({ items, className, duration = 40 }: Props) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <Fragment key={`${item}-${i}`}>
          <span className="px-6 md:px-10 whitespace-nowrap">{item}</span>
          <span className="text-loc-copper" aria-hidden="true">✦</span>
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
