"use client"

import { useEffect, useState } from "react"

const DESTINATIONS = [
  "Morocco",
  "Paris",
  "Greece",
  "Belgium",
  "London",
  "Madrid",
  "Barcelona",
  "Bali",
  "Kyoto",
  "Amsterdam",
  "Santorini",
  "Prague",
  "Shenzhen",
  "Hangzhou",
  "the World",
]

const TYPE_MS = 75
const DELETE_MS = 40
const PAUSE_AFTER_TYPE = 1600
const PAUSE_BEFORE_NEXT = 350
const FINAL_HOLD = 3200

type Phase = "typing" | "pausing" | "deleting" | "holding"

export function TypewriterTitle() {
  const [text, setText] = useState("")
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")

  useEffect(() => {
    const dest = DESTINATIONS[idx]
    const isFinal = idx === DESTINATIONS.length - 1

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
        timer = setTimeout(() => setText((t) => t.slice(0, -1)), DELETE_MS)
      } else {
        timer = setTimeout(() => {
          setIdx((i) => i + 1)
          setPhase("typing")
        }, PAUSE_BEFORE_NEXT)
      }
    } else {
      // "holding" — pause on "the World" then loop
      timer = setTimeout(() => {
        setText("")
        setIdx(0)
        setPhase("typing")
      }, FINAL_HOLD)
    }

    return () => clearTimeout(timer)
  }, [text, idx, phase])

  return (
    <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-6">
      Discover{" "}
      <span className="text-loc-amber whitespace-nowrap">
        {text}
        <span
          className="inline-block w-[3px] h-[0.85em] bg-loc-amber ml-1 align-text-bottom animate-[blink_1s_step-end_infinite]"
          aria-hidden="true"
        />
      </span>
    </h1>
  )
}
