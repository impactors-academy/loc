"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  images: string[]
  title: string
}

// Airbnb-style grid: one large hero photo plus up to four thumbnails, any
// tile opens the same photo full-screen with prev/next.
export function PropertyGallery({ images, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const shown = images.slice(0, 5)
  const remaining = images.length - shown.length

  const close = () => setOpenIndex(null)
  const prev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  const next = () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-72 md:h-96 mb-8">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="relative col-span-4 row-span-2 sm:col-span-2 sm:row-span-2 group"
        >
          <Image src={shown[0]} alt={title} fill className="object-cover group-hover:brightness-90 transition-all" sizes="50vw" priority />
        </button>
        {shown.slice(1, 5).map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setOpenIndex(i + 1)}
            className="relative hidden sm:block group"
          >
            <Image src={src} alt={`${title} photo ${i + 2}`} fill className="object-cover group-hover:brightness-90 transition-all" sizes="25vw" />
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                +{remaining} more
              </div>
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={close}>
          <button type="button" onClick={close} className="absolute top-6 right-6 text-white/80 hover:text-white" aria-label="Close gallery">
            <X className="w-7 h-7" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 md:left-8 text-white/80 hover:text-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 md:right-8 text-white/80 hover:text-white"
                aria-label="Next photo"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </>
          )}
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-6" onClick={(e) => e.stopPropagation()}>
            <Image src={images[openIndex]} alt={`${title} photo ${openIndex + 1}`} fill className="object-contain" sizes="100vw" />
          </div>
          <span className="absolute bottom-6 text-white/60 text-sm">{openIndex + 1} / {images.length}</span>
        </div>
      )}
    </>
  )
}
