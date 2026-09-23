"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** "section" fades the whole block up. "stagger" animates direct ScrollRevealItem children in sequence. */
  variant?: "section" | "stagger"
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "section",
}: ScrollRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  if (variant === "stagger") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px" }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Wrap individual items inside a <ScrollReveal variant="stagger"> parent */
export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={staggerChildVariants}>
      {children}
    </motion.div>
  )
}
