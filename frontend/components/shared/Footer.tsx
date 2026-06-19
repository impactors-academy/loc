import { SITE_NAME } from "@/lib/constants"
import Link from "next/link"

const FOOTER_SECTIONS = [
  {
    heading: "Explore",
    links: [
      { label: "Experiences", href: "/experiences" },
      { label: "Places to Stay", href: "/stays" },
      { label: "Digital Store", href: "/store" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "For Businesses",
    links: [
      { label: "List Your Experience", href: "/promote" },
      { label: "Advertise with LOC", href: "/promote" },
      { label: "Partner Packages", href: "/promote" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About LOC", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-loc-night text-neutral-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <p className="font-heading text-white text-2xl font-bold">{SITE_NAME}</p>
            <p className="text-sm mt-3 leading-relaxed text-neutral-400 max-w-xs">
              Your global tourism connector — curated experiences, handpicked stays, and digital travel guides from around the world.
            </p>
            <div className="flex gap-5 mt-6">
              <a
                href="https://instagram.com/loctravels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LOC on Instagram"
                className="text-neutral-500 hover:text-loc-amber transition-colors text-sm font-medium"
              >
                Instagram
              </a>
              <a
                href="https://tiktok.com/@loctravels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LOC on TikTok"
                className="text-neutral-500 hover:text-loc-amber transition-colors text-sm font-medium"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
                {section.heading}
              </p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-loc-amber transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800 py-6">
        <p className="text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Made for curious travellers everywhere.
        </p>
      </div>
    </footer>
  )
}
