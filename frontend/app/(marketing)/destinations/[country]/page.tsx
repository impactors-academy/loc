import { DestinationTabs } from "@/components/features/destinations/DestinationTabs"
import { DESTINATIONS_META } from "@/lib/destinations"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ country: string }>
}

export function generateStaticParams() {
  return DESTINATIONS_META.map((d) => ({ country: d.country }))
}

function findDest(raw: string) {
  return DESTINATIONS_META.find(
    (d) => d.country.toLowerCase() === raw.toLowerCase()
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  const dest = findDest(country)
  if (!dest) return {}
  return {
    title: `${dest.country} — Experiences & Stays | LOC`,
    description: dest.intro,
  }
}

export default async function DestinationPage({ params }: Props) {
  const { country } = await params
  const dest = findDest(country)
  if (!dest) notFound()

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end">
        <Image
          src={dest.heroPhoto}
          alt={dest.country}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/70"
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Link
            href="/"
            className="text-white/70 text-sm mb-5 inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            ← All destinations
          </Link>
          <p className="font-sans text-loc-amber uppercase tracking-widest text-xs font-medium mb-2">
            {dest.tagline}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-none">
            {dest.country}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-loc-sand py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-sans text-loc-night text-lg leading-relaxed">{dest.intro}</p>
        </div>
      </section>

      {/* Experiences & Stays tabs */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <DestinationTabs country={country} />
        </div>
      </section>
    </>
  )
}
