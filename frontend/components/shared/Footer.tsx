import { NAV_LINKS, SITE_NAME } from "@/lib/constants"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-neutral-950 text-neutral-400 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-start justify-between gap-8">
        <div>
          <p className="text-white font-bold text-lg">{SITE_NAME}</p>
          <p className="text-sm mt-1">Your gateway to Morocco.</p>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="text-center text-xs mt-8 text-neutral-600">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </p>
    </footer>
  )
}
