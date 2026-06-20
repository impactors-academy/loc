import type { Experience, Property } from "@/lib/types"

export const FEATURED_EXPERIENCES: Experience[] = [
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

export const FEATURED_PROPERTIES: Property[] = [
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

export const STATS = [
  { value: "50+", label: "Curated Experiences" },
  { value: "20+", label: "Countries" },
  { value: "120+", label: "Handpicked Stays" },
  { value: "1,000+", label: "Happy Travellers" },
]

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
    imageUrl: "https://images.unsplash.com/photo-1568393691622-c7ba131d1b16?w=800",
  },
]

export const DESTINATIONS = [
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
