"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { label: "Overview", href: "/dashboard" },
  { label: "Experiences", href: "/dashboard/experiences" },
  { label: "Properties", href: "/dashboard/properties" },
  { label: "Blog", href: "/dashboard/blog" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Inquiries", href: "/dashboard/inquiries" },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-loc-night text-white flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="font-heading font-bold text-loc-amber text-xl tracking-tight">LOC Admin</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? path === "/dashboard"
              : path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-loc-terracotta text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="text-xs text-white/40 hover:text-white/80 transition-colors">
          ← View site
        </Link>
      </div>
    </aside>
  )
}
