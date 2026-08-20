"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { MotionConfig } from "framer-motion"
import { useState } from "react"
import { makeQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {/* reducedMotion="user" makes every framer-motion animation follow the OS
          setting: transform animations (the y-offset in fadeInUp) are dropped
          while opacity still fades, so content appears without moving. CSS alone
          cannot do this. framer-motion drives inline styles from JS, so the
          prefers-reduced-motion block in globals.css never sees these. */}
      <MotionConfig reducedMotion="user">
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </MotionConfig>
    </QueryClientProvider>
  )
}
