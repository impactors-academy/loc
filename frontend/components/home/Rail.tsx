"use client"

import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

interface Props {
  children: ReactNode
  prevLabel: string
  nextLabel: string
  header: ReactNode
  className?: string
}

// A horizontal, snap-scrolling row with its own previous/next buttons. Native
// scrolling does the work (touch, trackpad, keyboard); the buttons just page it.
export function Rail({ children, prevLabel, nextLabel, header, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    update()
    const el = trackRef.current
    el?.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el?.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [update])

  const page = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" })
  }

  const btn =
    "glass-light h-12 w-12 rounded-full flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta"

  return (
    <div className={className}>
      <div className="container mx-auto px-4 flex items-end justify-between gap-6 mb-10">
        {header}
        <div className="hidden md:flex gap-2 shrink-0 mb-10">
          <button type="button" className={btn} onClick={() => page(-1)} disabled={edges.start} aria-label={prevLabel}>
            <ArrowLeft size={18} />
          </button>
          <button type="button" className={btn} onClick={() => page(1)} disabled={edges.end} aria-label={nextLabel}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className={cn(
          "flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2",
          // Align the first card with the container edge while letting the row
          // bleed off the right side of the viewport.
          "px-4 scroll-px-4 md:px-[max(1rem,calc((100vw-1400px)/2+1rem))] md:scroll-px-[max(1rem,calc((100vw-1400px)/2+1rem))]"
        )}
      >
        {children}
      </div>
    </div>
  )
}
