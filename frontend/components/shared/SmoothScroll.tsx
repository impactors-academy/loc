"use client"

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  // Lenis keeps its own scroll target, so a route change has to reset it or the
  // next page opens wherever the previous one was left.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
  }, [pathname])

  return null
}
