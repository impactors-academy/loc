import { ExperienceCard } from "@/components/features/experiences/ExperienceCard"
import { PropertyCard } from "@/components/features/stays/PropertyCard"
import { HeroSection } from "@/components/shared/HeroSection"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Experience, Property } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

const FEATURED_EXPERIENCES: Experience[] = [
  {
    id: "1",
    slug: "kyoto-tea-ceremony",
    title: "Traditional Tea Ceremony — Kyoto",
    description:
      "Step inside a 200-year-old machiya townhouse and learn the art of chado from a certified tea master. Matcha, wagashi sweets, and meditative silence included.",
    category: "culture",
    country: "Japan",
    location: "Higashiyama, Kyoto",
    duration: "2 hours",
    priceMin: 45,
    priceMax: 65,
    images: ["https://images.unsplash.com/photo-1568393691622-c7ba131d1b16?w=800"],
    isFeatured: true,
    providerName: "Kyoto Tea House",
    providerContact: null,
    referralUrl: "#",
  },
  {
    id: "2",
    slug: "santorini-sailing-sunset",
    title: "Catamaran Sunset Sail — Santorini",
    description:
      "Board a catamaran, snorkel above volcanic reef, and anchor off Oia for the world-famous sunset. BBQ dinner and open bar included.",
    category: "water",
    country: "Greece",
    location: "Oia, Santorini",
    duration: "5 hours",
    priceMin: 110,
    priceMax: 150,
    images: ["https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800"],
    isFeatured: true,
    providerName: "Santorini Catamarans",
    providerContact: null,
    referralUrl: "#",
  },
  {
    id: "3",
    slug: "tuscany-cooking-class",
    title: "Tuscan Farmhouse Cooking Class — Siena",
    description:
      "Make fresh pici pasta and wild boar ragù in a 14th-century farmhouse kitchen, followed by a long-table lunch in the olive grove with Brunello di Montalcino.",
    category: "culinary",
    country: "Italy",
    location: "Chianti, Siena Province",
    duration: "Full day",
    priceMin: 95,
    priceMax: 130,
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"],
    isFeatured: false,
    providerName: "Casa Toscana",
    providerContact: null,
    referralUrl: "#",
  },
]

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "1",
    slug: "kyoto-ryokan-higashiyama",
    title: "Ryokan Kiyomizu — Higashiyama, Kyoto",
    description:
      "A family-run ryokan on the stone-paved Ninenzaka lane with futon beds, yukata robes, and private hinoki wood baths. Kaiseki dinner included.",
    type: "ryokan",
    country: "Japan",
    priceMin: 220,
    priceMax: 380,
    location: "Higashiyama, Kyoto",
    images: ["https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800"],
    listingTier: "premium",
    ownerContact: null,
  },
  {
    id: "2",
    slug: "provence-mas-villa",
    title: "Mas Provençal — Luberon Valley",
    description:
      "An 18th-century stone farmhouse with a 12-metre pool and lavender terraces. Sleeps 8; private chef available. Ideal May–July for the bloom.",
    type: "villa",
    country: "France",
    priceMin: 450,
    priceMax: 750,
    location: "Lourmarin, Luberon",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    listingTier: "premium",
    ownerContact: null,
  },
  {
    id: "3",
    slug: "riad-zouak-marrakech",
    title: "Riad Zouak — Marrakech Medina",
    description:
      "Seven rooms around a central courtyard fountain, each adorned with hand-painted zellij tilework. Rooftop terrace with Atlas views.",
    type: "riad",
    country: "Morocco",
    priceMin: 120,
    priceMax: 220,
    location: "Marrakech Medina",
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
    listingTier: "featured",
    ownerContact: null,
  },
]

const STATS = [
  { value: "50+", label: "Curated Experiences" },
  { value: "20+", label: "Countries" },
  { value: "120+", label: "Handpicked Stays" },
  { value: "1,000+", label: "Happy Travellers" },
]

const CATEGORIES = [
  {
    title: "Adventures",
    subtitle: "Treks, dunes & volcano hikes",
    href: "/experiences?category=adventure",
    gradient: "from-amber-950 via-orange-900 to-amber-800",
    icon: "🏔️",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  },
  {
    title: "Wellness & Spa",
    subtitle: "Hammams, ryokans & serenity",
    href: "/experiences?category=wellness",
    gradient: "from-emerald-950 via-teal-900 to-emerald-800",
    icon: "🧘",
    imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
  },
  {
    title: "Culinary",
    subtitle: "Wine, cooking classes & markets",
    href: "/experiences?category=culinary",
    gradient: "from-red-950 via-rose-900 to-red-800",
    icon: "🍷",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  },
  {
    title: "Cultural",
    subtitle: "Temples, souks & history",
    href: "/experiences?category=culture",
    gradient: "from-purple-950 via-indigo-900 to-purple-800",
    icon: "🏯",
    imageUrl: "https://images.unsplash.com/photo-1568393691622-c7ba131d1b16?w=800",
  },
]

const DESTINATIONS = [
  {
    country: "Japan",
    tagline: "Temples & Traditions",
    photo: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "France",
    tagline: "Joie de Vivre",
    photo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "Morocco",
    tagline: "Dunes & Medinas",
    photo: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "Bali",
    tagline: "Spiritual & Serene",
    photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "Greece",
    tagline: "Islands & History",
    photo: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "United Kingdom",
    tagline: "Culture & Castles",
    photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "Italy",
    tagline: "Art & Cuisine",
    photo: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&auto=format&fit=crop&q=80",
  },
  {
    country: "Belgium",
    tagline: "Hidden European Gem",
    photo: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=600&auto=format&fit=crop&q=80",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse & Discover",
    desc: "Explore curated experiences, handpicked stays, and hidden gems from around the world — filtered to match your travel style.",
  },
  {
    step: "02",
    title: "Connect Directly",
    desc: "Reach out to providers and hosts through our simple inquiry form. No middleman, no hidden fees.",
  },
  {
    step: "03",
    title: "Live the Experience",
    desc: "Set off knowing every detail has been vetted by travellers who know and love the destination.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <HeroSection
        animated
        showSearch
        subtitle="Experiences, stays, and hidden gems — curated by people who live there."
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

      {/* ── Popular Destinations ────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Browse by destination"
            title="Popular Destinations"
            subtitle="Pick a place and dive in — experiences and stays filtered just for that corner of the world."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.country}
                href={`/experiences?country=${encodeURIComponent(dest.country)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end hover:scale-[1.02] transition-transform duration-300 shadow-md"
              >
                <Image
                  src={dest.photo}
                  alt={dest.country}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70"
                  aria-hidden="true"
                />
                <div className="relative z-10 p-4">
                  <h3 className="font-heading text-white text-base font-bold leading-tight">
                    {dest.country}
                  </h3>
                  <p className="font-sans text-white/70 text-xs mt-0.5">{dest.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category grid ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Explore by type"
            title="What will you discover?"
            subtitle="From Sahara dunes to Japanese tea houses, a different adventure waits around every corner."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end p-5 hover:scale-[1.02] transition-transform duration-300 shadow-md"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
                <div
                  className={`absolute inset-0 ${
                    cat.imageUrl
                      ? "bg-gradient-to-b from-black/10 via-black/20 to-black/75"
                      : `bg-gradient-to-b ${cat.gradient}`
                  }`}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  {!cat.imageUrl && (
                    <span className="text-4xl mb-3 block select-none">{cat.icon}</span>
                  )}
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
              subtitle="Unforgettable moments crafted by the world's finest local providers."
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
            subtitle="We connect curious travellers with authentic local providers — directly, with no booking engine in the way."
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
              subtitle="Ryokans, riads, villas, and farmhouses — selected for their character, comfort, and location."
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
            List your experience, property, or tourism service and reach thousands of travellers
            actively searching for authentic destinations around the world.
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
