// The three countries LOC actually operates in. Not tied to live listing
// inventory — Belgium has no products yet (comingSoon), and this is meant to
// read as "where we are," not "browse real listings here." Each photo is a
// landmark/iconic touristic site rather than a generic city street, and each
// was opened directly (not just picked by ID) to confirm it actually shows
// what its filename/search term implies before shipping it.
export const FEATURED_CITIES = [
  {
    country: "Morocco",
    tagline: "Jemaa el-Fnaa, Marrakech",
    photo: "https://images.unsplash.com/photo-1517821115309-2c35b3906a7b?w=1600&auto=format&fit=crop&q=80",
    comingSoon: false,
  },
  {
    country: "France",
    tagline: "The Eiffel Tower, Paris",
    photo: "https://images.unsplash.com/photo-1439393161192-32360eb753f1?w=1600&auto=format&fit=crop&q=80",
    comingSoon: false,
  },
  {
    country: "Belgium",
    tagline: "Grand Place, Brussels",
    photo: "https://images.unsplash.com/photo-1548092304-e0205cb0031b?w=1600&auto=format&fit=crop&q=80",
    comingSoon: true,
  },
]

// Real, verifiable claims only — no invented totals. Stay/country counts are
// computed at render time in page.tsx (live property count, FEATURED_CITIES
// length) rather than hardcoded here, so they can't silently go stale.
export const COMMISSION_STAT = { value: "0%", label: "Booking Commission" }

export const CATEGORIES = [
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
    imageUrl: "https://images.unsplash.com/photo-1743515483156-6bf698521774?w=800",
  },
]

export const HOW_IT_WORKS = [
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
