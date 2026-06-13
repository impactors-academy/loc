import { ExperienceCard } from "@/components/features/experiences/ExperienceCard"
import { PropertyCard } from "@/components/features/stays/PropertyCard"
import { HeroSection } from "@/components/shared/HeroSection"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Experience, Property } from "@/lib/types"
import Link from "next/link"

// ─── Stub data — replace with TanStack Query hooks in EXP-1 / STAY-1 ──────────

const FEATURED_EXPERIENCES: Experience[] = [
  {
    id: "1",
    slug: "hot-air-balloon-marrakech",
    title: "Hot Air Balloon over Marrakech",
    description:
      "Float above the ancient medina and Atlas Mountains at dawn in this once-in-a-lifetime aerial experience.",
    category: "aerial",
    priceRange: "From €180 / person",
    location: "Marrakech",
    imageUrl: "",
    providerName: "Sky Morocco",
    referralUrl: "#",
  },
  {
    id: "2",
    slug: "camel-trek-merzouga",
    title: "Sahara Camel Trek & Desert Camp",
    description:
      "Trek into the golden Erg Chebbi dunes on camelback and sleep under a million desert stars.",
    category: "adventure",
    priceRange: "From €95 / person",
    location: "Merzouga",
    imageUrl: "",
    providerName: "Sahara Nomads",
    referralUrl: "#",
  },
  {
    id: "3",
    slug: "hammam-ritual-fes",
    title: "Traditional Hammam & Argan Ritual",
    description:
      "Restore your body in a centuries-old hammam ceremony with locally sourced argan oil and rose water.",
    category: "wellness",
    priceRange: "From €55 / person",
    location: "Fès",
    imageUrl: "",
    providerName: "Riad Wellness",
    referralUrl: "#",
  },
]

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "riad-atlas-marrakech",
    title: "Riad Atlas — Old Medina",
    description:
      "A beautifully restored 9th-century riad hidden in the labyrinthine heart of the old medina.",
    type: "local-stay",
    priceRange: "From €120 / night",
    location: "Marrakech",
    imageUrl: "",
    contactUrl: "#",
  },
  {
    id: "2",
    slug: "villa-palmeraie",
    title: "Villa Palmeraie — Private Pool",
    description:
      "A modern villa with a private pool and lush garden, set in the tranquil Palmeraie.",
    type: "villa",
    priceRange: "From €350 / night",
    location: "Marrakech",
    imageUrl: "",
    contactUrl: "#",
  },
  {
    id: "3",
    slug: "apartment-agdal-rabat",
    title: "Modern Apartment — Agdal",
    description:
      "Spacious, architect-designed apartment in Rabat's most prestigious neighborhood, walkable to everything.",
    type: "apartment",
    priceRange: "From €85 / night",
    location: "Rabat",
    imageUrl: "",
    contactUrl: "#",
  },
]

const STATS = [
  { value: "50+", label: "Curated Experiences" },
  { value: "120+", label: "Handpicked Properties" },
  { value: "6", label: "Regions Covered" },
  { value: "1,000+", label: "Happy Travelers" },
]

const CATEGORIES = [
  {
    title: "Desert Adventures",
    subtitle: "Quads, camels & dunes",
    href: "/experiences?category=adventure",
    gradient: "from-amber-950 via-orange-900 to-amber-800",
    icon: "🏜️",
    imageUrl: "/images/categories/adventure.jpg",
  },
  {
    title: "Wellness & Spa",
    subtitle: "Hammams, riads & serenity",
    href: "/experiences?category=wellness",
    gradient: "from-emerald-950 via-teal-900 to-emerald-800",
    icon: "🧘",
    imageUrl: "/images/categories/wellness.jpg",
  },
  {
    title: "Cultural Tours",
    subtitle: "Medinas, souks & history",
    href: "/experiences?category=cultural",
    gradient: "from-purple-950 via-indigo-900 to-purple-800",
    icon: "🕌",
    imageUrl: "/images/categories/cultural.jpg",
  },
  {
    title: "Aerial & Sky",
    subtitle: "Hot air balloons & paragliding",
    href: "/experiences?category=aerial",
    gradient: "from-sky-950 via-blue-900 to-sky-800",
    icon: "🎈",
    imageUrl: "/images/categories/aerial.jpg",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse & Discover",
    desc: "Explore curated experiences, handpicked stays, and hidden gems across Morocco — filtered to match your travel style.",
  },
  {
    step: "02",
    title: "Connect Directly",
    desc: "Reach out to providers and hosts through our simple inquiry form. No middleman, no hidden fees.",
  },
  {
    step: "03",
    title: "Live the Experience",
    desc: "Set off knowing every detail has been vetted by locals who know and love this land.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <HeroSection
        title="Discover Morocco"
        subtitle="Experiences, stays, and hidden gems — curated by people who live here."
        ctaLabel="Explore Experiences"
        ctaHref="/experiences"
        ctaSecondaryLabel="Find a Stay"
        ctaSecondaryHref="/stays"
        videoUrl="/videos/sahara_hero_horizontal.mp4"
        imageUrl="/images/hero.jpg"
      />

      {/* ── Trust stats ─────────────────────────────────────────────────── */}
      <section className="bg-loc-sand py-10" aria-label="Platform statistics">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold text-loc-terracotta">{stat.value}</p>
                <p className="font-sans text-sm text-loc-stone mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Explore Morocco"
            title="What will you discover?"
            subtitle="From the Sahara to the Atlas, Morocco holds a different adventure around every corner."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end p-5 hover:scale-[1.02] transition-transform duration-300 shadow-md"
              >
                {/* Background image */}
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                {/* Gradient overlay — full card when no image, bottom scrim when image present */}
                <div
                  className={`absolute inset-0 ${
                    cat.imageUrl
                      ? "bg-gradient-to-b from-black/10 via-black/20 to-black/75"
                      : `bg-gradient-to-b ${cat.gradient}`
                  }`}
                  aria-hidden="true"
                />
                {/* Content */}
                <div className="relative z-10">
                  <span className="text-4xl mb-3 block select-none">{cat.icon}</span>
                  <h3 className="font-heading text-white text-lg font-bold leading-tight">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-white/70 text-xs mt-1">{cat.subtitle}</p>
                </div>
                <span
                  className="absolute top-4 right-4 text-white/30 group-hover:text-white/70 transition-colors text-xl z-10"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Experiences ─────────────────────────────────────────────── */}
      <section className="bg-loc-cream py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <SectionHeader
              eyebrow="Handpicked for you"
              title="Top Experiences"
              subtitle="Unforgettable moments crafted by Morocco's finest local providers."
            />
            <Link
              href="/experiences"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta hover:text-loc-terracotta/80 transition-colors mb-10 shrink-0"
            >
              See all experiences <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_EXPERIENCES.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta"
            >
              See all experiences →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How LOC Works ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Simple by design"
            title="How LOC Works"
            subtitle="We connect curious travelers with authentic Moroccan providers — directly, with no booking engine in the way."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <span className="font-heading text-6xl font-bold text-loc-sand select-none block mb-2">
                  {step.step}
                </span>
                <h3 className="font-heading text-xl font-bold text-loc-night mb-3">{step.title}</h3>
                <p className="font-sans text-loc-stone text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Handpicked Stays ────────────────────────────────────────────── */}
      <section className="bg-loc-sand/30 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <SectionHeader
              eyebrow="Places to call home"
              title="Handpicked Stays"
              subtitle="Riads, villas, and apartments selected for their character, comfort, and location."
            />
            <Link
              href="/stays"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta hover:text-loc-terracotta/80 transition-colors mb-10 shrink-0"
            >
              Browse all stays <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROPERTIES.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/stays"
              className="inline-flex items-center gap-1 text-sm font-medium text-loc-terracotta"
            >
              Browse all stays →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Partner CTA ─────────────────────────────────────────────────── */}
      <section className="bg-loc-night py-24">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="font-sans text-loc-amber uppercase tracking-widest text-xs font-medium mb-4">
            For Businesses
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white text-balance mb-5">
            Grow your business with LOC
          </h2>
          <p className="font-sans text-neutral-400 text-lg leading-relaxed mb-10">
            List your experience, property, or tourism service and reach thousands of travelers
            actively searching for what Morocco has to offer.
          </p>
          <Link
            href="/promote"
            className="inline-flex items-center px-8 py-4 rounded-full bg-loc-terracotta text-white font-semibold hover:bg-loc-terracotta/90 transition-all hover:scale-105 shadow-lg"
          >
            List with us
          </Link>
        </div>
      </section>
    </>
  )
}
