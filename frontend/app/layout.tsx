import { JsonLd } from "@/components/shared/JsonLd"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@/components/shared/Analytics"
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
    default: "LOC | Stays & Local Experiences in Morocco, France & Belgium",
    template: "%s | LOC",
  },
  description:
    "Handpicked villas and apartments in Morocco, France and Belgium, curated by locals, with direct host contact and no booking commission.",
  authors: [{ name: "LOC", url: "https://loctravels.com" }],
  creator: "LOC",
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "LOC",
  url: "https://loctravels.com",
  description:
    "Travel connector serving tourists in Morocco, France and Belgium. Curated experiences, handpicked stays, and digital travel guides.",
  areaServed: [
    { "@type": "Country", name: "Morocco" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "Belgium" },
  ],
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
        <JsonLd data={organizationSchema} />
        <Analytics />
        {children}
      </body>
    </html>
  )
}
