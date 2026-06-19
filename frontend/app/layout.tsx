import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://loctravels.com"),
  title: {
    default: "LOC — Discover the World | Experiences, Stays & Hidden Gems",
    template: "%s | LOC",
  },
  description:
    "Discover the best tourism experiences, stays, and hidden gems around the world — from Japan to Morocco, Bali to Bordeaux. Curated by people who love to travel.",
  keywords: [
    "travel experiences",
    "boutique stays",
    "hidden gems travel",
    "global tourism",
    "curated travel",
    "Japan travel",
    "France travel",
    "Bali travel",
    "Morocco travel",
    "LOC travel",
  ],
  authors: [{ name: "LOC", url: "https://loctravels.com" }],
  creator: "LOC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loctravels.com",
    siteName: "LOC",
    title: "LOC — Discover the World | Experiences, Stays & Hidden Gems",
    description:
      "Discover the best tourism experiences, stays, and hidden gems around the world.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "LOC — Discover the World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOC — Discover the World",
    description:
      "Discover the best tourism experiences, stays, and hidden gems around the world.",
    images: ["/images/og-default.jpg"],
    creator: "@loctravels",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://loctravels.com",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "LOC",
  url: "https://loctravels.com",
  description:
    "Your global tourism connector — curated experiences, handpicked stays, and digital travel products from around the world.",
  sameAs: [
    "https://instagram.com/loctravels",
    "https://tiktok.com/@loctravels",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
