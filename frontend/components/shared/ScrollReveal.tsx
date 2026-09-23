"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Use "section" for a whole block fade-up, "stagger" to animate direct children in sequence */
  variant?: "section" | "stagger"
}

const itemVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const staggerChildVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "section",
}: ScrollRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

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
      custom={delay}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
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
