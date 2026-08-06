"use client"

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

interface HeroVideoProps {
  videoUrl: string
  posterUrl?: string
}

/**
 * The hero's looping background video, gated on the OS "reduce motion" setting.
 *
 * `autoPlay` is a DOM attribute, so the prefers-reduced-motion block in
 * globals.css cannot stop it — a full-bleed video looping behind the headline is
 * exactly the kind of motion that setting exists to prevent. When reduce is on we
 * render the poster as a static backdrop instead, which is what the video's first
 * frame would have shown anyway.
 *
 * Rendered static-first so the server markup and the first client paint agree;
 * the video swaps in only once we know the preference (see the hook). Without
 * that the video would autoplay for a frame before being pulled.
 */
export function HeroVideo({ videoUrl, posterUrl }: HeroVideoProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return posterUrl ? (
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${posterUrl})` }}
        aria-hidden="true"
      />
    ) : null
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={posterUrl}
      className="absolute inset-0 w-full h-full object-cover scale-105"
      aria-hidden="true"
    >
      <source src={videoUrl} type="video/mp4" />
    </video>
  )
}
