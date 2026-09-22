"use client"

import { useEffect, useState } from "react"

/**
 * Tracks the OS "reduce motion" setting, and keeps tracking it — the listener
 * means toggling the preference takes effect without a reload.
 *
 * Starts as `true` (assume reduced) so the server render and the first client
 * paint agree on the still, non-animating version. The effect then relaxes it for
 * visitors who have not asked for reduced motion. Starting `false` would let a
 * video autoplay or a caret blink for a frame before being pulled back.
 *
 * Only for motion CSS cannot reach: JS timers and DOM attributes like `autoPlay`.
 * Plain CSS animations and transitions are already covered by the
 * prefers-reduced-motion block in globals.css, and framer-motion by the
 * MotionConfig in app/providers.tsx.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setPrefersReduced(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return prefersReduced
}
