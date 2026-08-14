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
      <div className="flex border-b border-border mb-8" role="tablist" aria-label="Destination content">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab.toLowerCase()}`}
            aria-selected={active === tab}
            aria-controls={`tabpanel-${tab.toLowerCase()}`}
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

      <div
        role="tabpanel"
        id={`tabpanel-${active.toLowerCase()}`}
        aria-labelledby={`tab-${active.toLowerCase()}`}
      >
        {active === "Experiences" ? (
          <ExperienceGrid country={country} />
        ) : (
          <PropertyGrid country={country} />
        )}
      </div>
    </div>
  )
}
