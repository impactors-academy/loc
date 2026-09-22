import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import "./globals.css"

const clashGrotesk = localFont({
  src: [
    { path: "./fonts/ClashGrotesk-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ClashGrotesk-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ClashGrotesk-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashGrotesk-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
})

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/GeneralSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://loctravels.com"),
  title: {
    default: "LOC | Discover the World | Experiences, Stays & Hidden Gems",
    template: "%s | LOC",
  },
  description:
    "Discover the best tourism experiences, stays, and hidden gems around the world, from Japan to Morocco, Bali to Bordeaux. Curated by people who love to travel.",
  authors: [{ name: "LOC", url: "https://loctravels.com" }],
  creator: "LOC",
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "LOC",
  url: "https://loctravels.com",
  description:
    "Your global tourism connector. Curated experiences, handpicked stays, and digital travel products from around the world.",
  sameAs: [
    "https://www.instagram.com/loc_ia24",
    "https://www.tiktok.com/@loc_ia",
    "https://www.facebook.com/share/19UDeeGCHH/",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${clashGrotesk.variable} ${generalSans.variable}`}>
      <body className="font-sans">
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
