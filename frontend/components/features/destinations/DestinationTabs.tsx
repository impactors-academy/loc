"use client"

import { ExperienceGrid } from "@/components/features/experiences/ExperienceGrid"
import { PropertyGrid } from "@/components/features/stays/PropertyGrid"
import { cn } from "@/lib/utils"
import { useState } from "react"

const TABS = ["Experiences", "Stays"] as const
type Tab = (typeof TABS)[number]

export function DestinationTabs({ country }: { country: string }) {
  const [active, setActive] = useState<Tab>("Experiences")

  return (
    <div>
      <div className="flex border-b border-border mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              active === tab
                ? "border-loc-terracotta text-loc-terracotta"
                : "border-transparent text-loc-stone hover:text-loc-night"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Experiences" ? (
        <ExperienceGrid country={country} />
      ) : (
        <PropertyGrid country={country} />
      )}
    </div>
  )
}
