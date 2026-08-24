import { SectionHeader } from "@/components/shared/SectionHeader"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"

// English only, for now — same call as /privacy and /contact, matching the
// existing /promote precedent in this route group.
//
// Deliberately restrained: only claims already made elsewhere on the site
// (the footer tagline, the hero subtitle, the "How LOC Works" line) plus the
// confirmed architecture fact that LOC is discovery + inquiry only. No
// founding story, no team bios, no numbers — those need real input from
// someone at the company, not an invented narrative.
export const metadata: Metadata = {
  title: "About LOC | LOC",
  description: "LOC is a global tourism connector — curated experiences, handpicked stays, and digital travel guides.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20">
      <section className="container mx-auto px-4 text-center max-w-2xl mb-16">
        <SectionHeader
          eyebrow="About"
          title="A global tourism connector"
          subtitle="Curated experiences, handpicked stays, and digital travel guides from around the world."
          center
        />
      </section>

      <section className="container mx-auto px-4 max-w-2xl mb-10">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm space-y-6">
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              How LOC works
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              We connect curious travellers with authentic local providers, directly, with no
              booking engine in the way. Browse experiences, stays, and local products curated
              by people who actually live in the places they cover &mdash; when something looks
              right, you reach out and the provider takes it from there.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              Discovery, not booking
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              LOC never processes bookings or payments itself. Every inquiry goes straight to
              the experience, stay, or product&rsquo;s own provider, who handles the rest
              directly with you.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-loc-night mb-2">
              Part of Impactors Academy
            </h2>
            <p className="text-loc-stone text-sm md:text-base leading-relaxed">
              LOC is one of the ventures built by{" "}
              <a
                href="https://impactorsacademy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-loc-terracotta"
              >
                Impactors Academy
              </a>
              , a platform building ventures across tourism, sport, finance, and technology.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-2xl text-center">
        <Link href="/contact" className="text-loc-terracotta text-sm font-medium hover:underline">
          Have a question? Get in touch →
        </Link>
      </section>
    </main>
  )
}
