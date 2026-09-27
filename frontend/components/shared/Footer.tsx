"use client"

import { SITE_NAME } from "@/lib/constants"
import { Link } from "@/i18n/navigation"
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons"
import { useTranslations } from "next-intl"

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/loc_ia24", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@loc_ia", Icon: TikTokIcon },
  { label: "Facebook", href: "https://www.facebook.com/share/19UDeeGCHH/", Icon: FacebookIcon },
]

export function Footer() {
  const t = useTranslations("footer")
  const nav = useTranslations("nav")

  const FOOTER_SECTIONS = [
    {
      heading: t("explore"),
      links: [
        { label: nav("stays"), href: "/stays" as const },
        { label: nav("experiences"), href: "/experiences" as const },
        { label: nav("blog"), href: "/blog" as const },
        { label: nav("store"), href: "/store" as const },
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
    <footer className="relative bg-loc-night text-white/60 overflow-hidden">
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-5">
            <p className="font-heading text-white text-3xl md:text-4xl font-semibold tracking-tight leading-[1.05] max-w-sm text-balance">
              {t("statement")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-sm">{t("tagline")}</p>
            <ul className="flex gap-3 mt-8">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE_NAME} on ${label}`}
                    title={label}
                    className="glass-dark h-12 w-12 rounded-full flex items-center justify-center hover:text-loc-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-copper"
                  >
                    <Icon size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-6 md:col-start-7 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className="text-loc-copper text-[11px] font-semibold uppercase tracking-[0.22em] mb-5">{section.heading}</p>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[15px] text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-xs text-white/60">
          <p>© {new Date().getFullYear()} {SITE_NAME}. {t("rights")}</p>
          <p>loctravels.com</p>
        </div>
      </div>

      {/* Viewport-scale wordmark, cropped at the bottom edge on purpose: it reads
          as texture, the real name is already in the header and the copyright. */}
      <p
        className="font-heading font-semibold leading-[0.75] tracking-[-0.05em] text-center text-white/[0.05] select-none -mb-[0.12em]"
        style={{ fontSize: "clamp(8rem, 38vw, 34rem)" }}
        aria-hidden="true"
      >
        {SITE_NAME}
      </p>
    </footer>
  )
}
