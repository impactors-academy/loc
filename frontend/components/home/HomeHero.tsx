"use client"

import { HeroVideo } from "@/components/shared/HeroVideo"
import { TypewriterTitle } from "@/components/shared/TypewriterTitle"
import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { HeroSearch } from "./HeroSearch"

const EASE = [0.19, 1, 0.22, 1] as const

interface Props {
  words: string[]
  hasExperiences: boolean
  stayCountries: string[]
  stayTypes: string[]
}

export function HomeHero({ words, hasExperiences, stayCountries, stayTypes }: Props) {
  const t = useTranslations("hero")
  const th = useTranslations("home")
  const tp = useTranslations("propertyTypes")
  // Quick links only point at stay types that have live listings.
  const quickLinks = [
    ...stayTypes.map((type) => ({ href: `/stays?type=${type}`, label: tp.has(type) ? tp(type) : type })),
    { href: "/stays", label: th("allStays") },
  ]

  return (
    <section className="relative isolate min-h-[100svh] flex flex-col overflow-hidden bg-loc-night">
      <HeroVideo videoUrl="/videos/sahara_hero_horizontal.mp4" posterUrl="/images/hero.jpg" />
      {/* Two layers: a floor gradient for the search and a left-side wash for the
          headline, so the video stays bright in the upper right. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col justify-end container mx-auto px-4 pt-28 pb-8 md:pb-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="inline-flex items-center gap-3 text-[11px] md:text-xs font-semibold uppercase tracking-[0.28em] text-white/80 mb-5"
        >
          <span className="h-px w-10 bg-loc-amber" aria-hidden="true" />
          {th("heroEyebrow")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        >
          <TypewriterTitle words={words} />
        </motion.div>

        <motion.div
          className="mt-7 md:mt-9"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.45 }}
        >
          <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed mb-6 text-pretty">
            {t("subtitle")}
          </p>
          <HeroSearch hasExperiences={hasExperiences} stayCountries={stayCountries} stayTypes={stayTypes} />
          <nav aria-label={th("quickLinksLabel")} className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm mr-1">{th("quickLinksLabel")}:</span>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-dark inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </section>
  )
}
