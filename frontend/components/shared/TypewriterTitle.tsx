"use client"

import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { useTranslations } from "next-intl"

const TYPE_MS = 75
const DELETE_MS = 40
const PAUSE_AFTER_TYPE = 1600
const PAUSE_BEFORE_NEXT = 350
const FINAL_HOLD = 3200

type Phase = "typing" | "pausing" | "deleting" | "holding"

export function TypewriterTitle({ words }: { words?: string[] }) {
  const [text, setText] = useState("")
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")
  const prefersReducedMotion = usePrefersReducedMotion()
  const t = useTranslations("hero")
  const destinations = words?.length ? words : (t.raw("destinations") as string[])

  useEffect(() => {
    if (prefersReducedMotion) return

    const dest = destinations[idx]
    const isFinal = idx === destinations.length - 1

    let timer: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < dest.length) {
        timer = setTimeout(() => setText(dest.slice(0, text.length + 1)), TYPE_MS)
      } else {
        timer = setTimeout(() => setPhase(isFinal ? "holding" : "pausing"), PAUSE_AFTER_TYPE)
      }
    } else if (phase === "pausing") {
      timer = setTimeout(() => setPhase("deleting"), 0)
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timer = setTimeout(() => setText((prev) => prev.slice(0, -1)), DELETE_MS)
      } else {
        timer = setTimeout(() => {
          setIdx((i) => i + 1)
          setPhase("typing")
        }, PAUSE_BEFORE_NEXT)
      }
    } else {
      timer = setTimeout(() => {
        setText("")
        setIdx(0)
        setPhase("typing")
      }, FINAL_HOLD)
    }

    return () => clearTimeout(timer)
  }, [text, idx, phase, prefersReducedMotion, destinations])

  const longest = destinations.reduce((a, b) => (a.length > b.length ? a : b))
  const finalWord = destinations[destinations.length - 1]

  return (
    <h1
      className="font-heading font-semibold tracking-[-0.045em] leading-[0.86] text-white"
      style={{ fontSize: "var(--loc-text-display)" }}
    >
      <span className="sr-only">
        {t("lead")} {destinations.join(", ")}
      </span>
      {/* The lead runs at a fraction of the display size: at full size
          "Serving tourists in" alone would fill the hero. */}
      <span aria-hidden="true" className="block text-[0.4em] tracking-[-0.03em] leading-none mb-[0.18em] text-white/90">{t("lead")}</span>
      {/* The invisible longest word holds the line's width so the headline
          never reflows while letters are typed and deleted. */}
      <span aria-hidden="true" className="inline-grid">
        <span className="col-start-1 row-start-1 invisible whitespace-nowrap">{longest}</span>
        <span className="col-start-1 row-start-1 text-loc-amber whitespace-nowrap">
          {prefersReducedMotion ? finalWord : text}
          {!prefersReducedMotion && (
            <span
              className="inline-block w-[0.06em] h-[0.78em] bg-loc-amber ml-[0.04em] align-baseline animate-[blink_1s_step-end_infinite]"
              aria-hidden="true"
            />
          )}
        </span>
      </span>
    </h1>
  )
}
