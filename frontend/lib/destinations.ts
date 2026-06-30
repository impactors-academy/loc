export type DestinationMeta = {
  country: string
  tagline: string
  heroPhoto: string
  intro: string
}

export const DESTINATIONS_META: DestinationMeta[] = [
  {
    country: "Japan",
    tagline: "Temples & Traditions",
    heroPhoto: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Ancient temples and bullet trains, cherry blossoms and kaiseki dinners — Japan rewards the curious traveller at every turn. From Kyoto's cobblestone lanes to the electric rhythm of Tokyo, every neighbourhood tells a different story.",
  },
  {
    country: "France",
    tagline: "Joie de Vivre",
    heroPhoto: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&auto=format&fit=crop&q=80",
    intro:
      "France is the art of living well, from sunlit Provençal markets to candlelit Parisian bistros. Whether you're cycling through Burgundy vineyards or strolling the Luberon, the country invites you to slow down and savour every moment.",
  },
  {
    country: "Morocco",
    tagline: "Dunes & Medinas",
    heroPhoto: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Mosaic-tiled riads, Saharan dunes, and the intoxicating scent of cumin drifting through a souk — Morocco immerses all the senses. A land where medieval medinas meet infinite desert horizons.",
  },
  {
    country: "Bali",
    tagline: "Spiritual & Serene",
    heroPhoto: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Terraced rice paddies, open-air temples, and a culture built around beauty and ceremony make Bali unlike anywhere else. Whether you seek surf, serenity, or spiritual renewal, the island meets you exactly where you are.",
  },
  {
    country: "Greece",
    tagline: "Islands & History",
    heroPhoto: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Whitewashed villages clinging to clifftops, cobalt seas, and a civilisation that shaped the world — Greece is as humbling as it is beautiful. Sail between islands, walk ancient sites, and feast on mezze as the sun sets over the Aegean.",
  },
  {
    country: "United Kingdom",
    tagline: "Culture & Castles",
    heroPhoto: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&auto=format&fit=crop&q=80",
    intro:
      "From the mist-draped Scottish Highlands to the Thames-side streets of London, the UK packs extraordinary variety into a compact geography. History at every corner, world-class museums, and pubs that make any evening worth staying for.",
  },
  {
    country: "Italy",
    tagline: "Art & Cuisine",
    heroPhoto: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Italy is a feast for every sense — Renaissance art in Florence, Baroque churches in Sicily, fresh pasta in Bologna. Every region is a distinct world, united by an unshakeable belief that life should be beautiful.",
  },
  {
    country: "Belgium",
    tagline: "Hidden European Gem",
    heroPhoto: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1600&auto=format&fit=crop&q=80",
    intro:
      "Belgium punches far above its size: world-class beer, Art Nouveau architecture in Brussels, medieval Bruges, and chocolate that sets the global standard. Europe's most underrated destination, ready to surprise you.",
  },
]

export const DESTINATION_BY_COUNTRY: Record<string, DestinationMeta> = Object.fromEntries(
  DESTINATIONS_META.map((d) => [d.country, d])
)
