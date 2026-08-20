"use client"

import { SITE_NAME } from "@/lib/constants"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")
  const nav = useTranslations("nav")

  const FOOTER_SECTIONS = [
    {
      heading: t("explore"),
      links: [
        { label: nav("experiences"), href: "/experiences" as const },
        { label: nav("stays"), href: "/stays" as const },
        { label: nav("store"), href: "/store" as const },
        { label: nav("blog"), href: "/blog" as const },
      ],
    },
    {
      heading: t("forBusinesses"),
      links: [
        { label: t("listExperience"), href: "/promote" as const },
        { label: t("advertise"), href: "/promote" as const },
        { label: t("partnerPackages"), href: "/promote" as const },
      ],
    },
    {
      heading: t("company"),
      links: [
        { label: t("aboutLoc"), href: "/about" as const },
        { label: t("contactUs"), href: "/contact" as const },
        { label: t("privacyPolicy"), href: "/privacy" as const },
      ],
    },
  ]

  return (
    <footer className="bg-loc-night text-neutral-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <p className="font-heading text-white text-2xl font-semibold">{SITE_NAME}</p>
            <p className="text-sm mt-3 leading-relaxed text-neutral-400 max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex gap-5 mt-6">
              <a href="https://www.instagram.com/loc_ia24" target="_blank" rel="noopener noreferrer" aria-label="LOC on Instagram" className="text-neutral-500 hover:text-loc-amber transition-colors text-sm font-medium">Instagram</a>
              <a href="https://www.tiktok.com/@loc_ia" target="_blank" rel="noopener noreferrer" aria-label="LOC on TikTok" className="text-neutral-500 hover:text-loc-amber transition-colors text-sm font-medium">TikTok</a>
              <a href="https://www.facebook.com/share/19UDeeGCHH/" target="_blank" rel="noopener noreferrer" aria-label="LOC on Facebook" className="text-neutral-500 hover:text-loc-amber transition-colors text-sm font-medium">Facebook</a>
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{section.heading}</p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-loc-amber transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800 py-6">
        <p className="text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} {SITE_NAME}. {t("rights")}
        </p>
      </div>
    </footer>
  )
}
