import { DESTINATIONS_META } from "@/lib/destinations"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Destinations | LOC",
  description: "Curated experiences and handpicked stays across the world's most rewarding destinations.",
}

export default function DestinationsPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl">
          <p className="text-loc-amber uppercase tracking-widest text-xs font-medium mb-3">
            Where do you want to go?
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-loc-night mb-4">
            Explore Destinations
          </h1>
          <p className="text-loc-stone text-lg leading-relaxed">
            Curated experiences and handpicked stays across the world's most rewarding destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATIONS_META.map((dest) => (
            <Link
              key={dest.country}
              href={`/destinations/${encodeURIComponent(dest.country)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
            >
              <Image
                src={dest.heroPhoto}
                alt={dest.country}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-loc-amber text-xs font-medium uppercase tracking-widest mb-1">
                  {dest.tagline}
                </p>
                <h2 className="font-heading text-xl font-bold text-white">{dest.country}</h2>
                <p className="text-white/60 text-sm mt-1.5 group-hover:text-white/90 transition-colors">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
