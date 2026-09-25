"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { useTranslations } from "next-intl"

export function CommissionStat() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const t = useTranslations("homepage")

  return (
    <div ref={ref} className="text-center max-w-md mx-auto">
      <motion.p
        className="font-heading text-5xl font-semibold text-loc-terracotta tabular-nums"
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        0%
      </motion.p>
      <p className="font-sans text-sm text-loc-stone mt-1">{t("commissionLabel")}</p>
      <p className="font-sans text-xs text-loc-stone/60 mt-1">{t("commissionSublabel")}</p>
    </div>
  )
}
