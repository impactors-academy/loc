"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

interface Props {
  images: string[]
  title: string
  showAllLabel?: string
}

// Airbnb-style grid: one large hero photo plus up to four thumbnails, any tile
// opens the same photo full-screen. A listing with a single photo gets it at
// full width instead of a half-empty grid.
export function PropertyGallery({ images, title, showAllLabel }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length])
  const next = useCallback(() => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)), [images.length])

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [openIndex, close, prev, next])

  if (images.length === 0) return null

  const shown = images.slice(0, 5)
  const single = images.length === 1

  return (
    <>
      <div
        className={cn(
          "relative rounded-[24px] overflow-hidden bg-loc-sand",
          single ? "h-[320px] md:h-[560px]" : "grid grid-cols-4 grid-rows-2 gap-2 h-[320px] md:h-[520px]"
        )}
      >
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className={cn("relative group block w-full h-full", !single && "col-span-4 row-span-2 sm:col-span-2")}
          aria-label={`${title}, photo 1 of ${images.length}`}
        >
          <Image src={shown[0]} alt={title} fill className="object-cover transition-[filter] group-hover:brightness-90" sizes="(max-width: 640px) 100vw, 66vw" priority />
        </button>
        {!single &&
          shown.slice(1, 5).map((src, i) => (
            <button
              type="button"
              key={src}
              onClick={() => setOpenIndex(i + 1)}
              className={cn("relative hidden sm:block group", shown.length === 2 && "col-span-2 row-span-2", shown.length === 3 && "col-span-2")}
              aria-label={`${title}, photo ${i + 2} of ${images.length}`}
            >
              <Image src={src} alt="" fill className="object-cover transition-[filter] group-hover:brightness-90" sizes="25vw" />
            </button>
          ))}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            className="glass-light absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
          >
            <Images size={16} aria-hidden="true" />
            {showAllLabel ?? `${images.length}`}
          </button>
        )}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button type="button" onClick={close} className="absolute top-5 right-5 h-11 w-11 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10" aria-label="Close gallery" autoFocus>
            <X className="w-6 h-6" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 md:left-8 h-12 w-12 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 md:right-8 h-12 w-12 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16" onClick={(e) => e.stopPropagation()}>
            <Image src={images[openIndex]} alt={`${title} photo ${openIndex + 1}`} fill className="object-contain" sizes="100vw" />
          </div>
          <span className="absolute bottom-6 text-white/60 text-sm tabular-nums">{openIndex + 1} / {images.length}</span>
        </div>
      )}
    </>
  )
}
