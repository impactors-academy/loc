"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface City {
  country: string
  tagline: string
  photo: string
  comingSoon: boolean
}

interface Props {
  cities: City[]
  comingSoonLabel: string
}

const AUTOPLAY_MS = 6000

export function FeaturedCitiesSlideshow({ cities, comingSoonLabel }: Props) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % cities.length), [cities.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + cities.length) % cities.length), [cities.length])

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [next])

  if (cities.length === 0) return null
  const city = cities[index]

  return (
    <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[480px] shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={city.country}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={city.photo}
            alt={city.country}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20"
            aria-hidden="true"
          />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
            {city.comingSoon && (
              <span className="self-start mb-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest">
                {comingSoonLabel}
              </span>
            )}
            <h3 className="font-heading text-white text-4xl md:text-5xl font-semibold">{city.country}</h3>
            <p className="font-sans text-white/80 text-base md:text-lg mt-2">{city.tagline}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {cities.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous city"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next city"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 right-8 z-20 flex gap-2">
            {cities.map((c, i) => (
              <button
                key={c.country}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${c.country}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
