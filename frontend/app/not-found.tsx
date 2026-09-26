import Link from "next/link"
import { Compass } from "lucide-react"

// Root-level fallback for routes that don't match any locale segment.
// The locale-aware version at app/[locale]/not-found.tsx handles most 404s.
export default function NotFound() {
  return (
    <main className="min-h-screen bg-loc-sand/20 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-loc-sand flex items-center justify-center mx-auto mb-7">
        <Compass size={28} strokeWidth={1.5} className="text-loc-terracotta" aria-hidden="true" />
      </div>

      <p className="font-sans text-loc-terracotta text-xs font-semibold uppercase tracking-[0.2em] mb-4">
        404
      </p>

      <h1 className="font-heading text-3xl md:text-4xl font-semibold text-loc-night text-balance mb-4 max-w-sm">
        We couldn&apos;t find that page
      </h1>

      <p className="font-sans text-loc-stone text-base leading-relaxed max-w-sm mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center px-7 py-3 rounded-full bg-loc-terracotta text-white text-sm font-semibold hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-md shadow-loc-terracotta/20"
        >
          Back to home
        </Link>
        <Link
          href="/en/experiences"
          className="inline-flex items-center px-7 py-3 rounded-full border border-loc-stone/30 text-loc-stone text-sm font-medium hover:border-loc-terracotta hover:text-loc-terracotta transition-colors"
        >
          Browse experiences
        </Link>
      </div>
    </main>
  )
}
