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
    default: "LOC — Discover Morocco | Experiences, Stays & Hidden Gems",
    template: "%s | LOC Morocco",
  },
  description:
    "Discover the best tourism experiences, stays, and hidden gems across Morocco. Quad biking, desert tours, riads, and more — curated by locals who love this land.",
  keywords: [
    "Morocco travel",
    "Morocco experiences",
    "Morocco stays",
    "tourism Morocco",
    "Marrakech activities",
    "Morocco adventures",
    "desert tours Morocco",
    "Moroccan riads",
    "travel guide Morocco",
    "LOC Morocco",
  ],
  authors: [{ name: "LOC", url: "https://loc.ma" }],
  creator: "LOC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loc.ma",
    siteName: "LOC Morocco",
    title: "LOC — Discover Morocco | Experiences, Stays & Hidden Gems",
    description:
      "Discover the best tourism experiences, stays, and hidden gems across Morocco.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "LOC — Discover Morocco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOC — Discover Morocco",
    description:
      "Discover the best tourism experiences, stays, and hidden gems across Morocco.",
    images: ["/images/og-default.jpg"],
    creator: "@locmorocco",
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
    canonical: "https://loc.ma",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "LOC Morocco",
  url: "https://loc.ma",
  description:
    "Morocco's premier tourism connector — curated experiences, handpicked stays, and digital travel products.",
  areaServed: { "@type": "Country", name: "Morocco" },
  sameAs: [
    "https://instagram.com/locmorocco",
    "https://tiktok.com/@locmorocco",
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
