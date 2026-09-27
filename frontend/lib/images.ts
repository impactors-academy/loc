// Curated Unsplash photo IDs by category/type.
// Cards call getPoolImage(category, slug) for a consistent-but-varied image
// when the item has no images stored in the DB yet.

// Every entry here was checked by eye against its label (2026-09-27): several
// earlier IDs showed something else entirely (a clothes rack for "cycling", a
// concert for "hot air balloon", Monument Valley for "sahara dunes").
const pool: Record<string, string[]> = {
  adventure: [
    "photo-1464822759023-fed622ff2c3b", // mountain valley
    "photo-1502680390469-be75c86b636f", // surfing
    "photo-1483683804023-6ccdb62f86ef", // aerial coastline
    "photo-1544551763-46a013bb70d5", // scuba diving
    "photo-1507525428034-b723cf961d3e", // beach at sunset
  ],
  wellness: [
    "photo-1545389336-cf090694435e", // yoga above the clouds
    "photo-1506126613408-eca07ce68773", // meditation at sunset
    "photo-1600334129128-685c5582fd35", // hot stone massage
    "photo-1599901860904-17e6ed7083a0", // yoga pose, black and white
  ],
  culture: [
    "photo-1539020140153-e479b8c22e70", // zellige fountain, Morocco
    "photo-1565193566173-7a0ee3dbe261", // ceramics still life
    "photo-1539037116277-4db20889f2d4", // old city rooftops at dusk
  ],
  culinary: [
    "photo-1556909114-f6e7ad7d3136", // cooking class
    "photo-1414235077428-338989a2e8c0", // plated dish
    "photo-1510812431401-41d2bd2722f3", // wine tasting
    "photo-1517248135467-4c7edcad34c4", // restaurant interior
    "photo-1504674900247-0877df9cc836", // shared plates
    "photo-1565958011703-44f9829ba187", // pastry
  ],
  water: [
    "photo-1507525428034-b723cf961d3e", // beach at sunset
    "photo-1544551763-46a013bb70d5", // diving
    "photo-1502680390469-be75c86b636f", // surfing
    "photo-1519046904884-53103b34b206", // palm beach
    "photo-1567899378494-47b22a2ae96a", // yacht
  ],
  aerial: [
    "photo-1483683804023-6ccdb62f86ef", // aerial coastline
  ],
  // property types
  riad: [
    "photo-1539020140153-e479b8c22e70", // zellige fountain
    "photo-1489749798305-4fea3ae63d43", // kasbah and palm grove
  ],
  villa: [
    "photo-1566073771259-6a8506099945", // infinity pool villa
    "photo-1613490493576-7fde63acd811", // modern villa
    "photo-1520250497591-112f2f40a3f4", // villa terrace
  ],
  apartment: [
    "photo-1522708323590-d24dbb6b0267", // bright apartment
    "photo-1502672260266-1c1ef2d93688", // studio loft
  ],
  gite: [
    "photo-1449158743715-0a90ebb6d2d8", // forest cabin
    "photo-1510798831971-661eb04b3739", // winter cabin
  ],
  hotel: [
    "photo-1551882547-ff40c63fe5fa", // boutique hotel at dusk
    "photo-1618773928121-c32242e63f39", // hotel room
  ],
  bivouac: [
    "photo-1489749798305-4fea3ae63d43", // kasbah and palm grove
  ],
  default: [
    "photo-1476514525535-07fb3b4ae5f1", // lake and mountains
    "photo-1500835556837-99ac94a94552", // sky from above
    "photo-1488085061387-422e29b40080", // wing at sunset
    "photo-1530521954074-e64f6810b32d", // traveller at the airport
  ],
}

// One photo per country LOC operates in, each checked by eye to actually show
// that country: Marrakech under the Atlas, Paris, Dinant on the Meuse.
const DESTINATIONS: Record<string, string> = {
  Morocco: "photo-1597212618440-806262de4f6b",
  France: "photo-1502602898657-3e91760cbb34",
  Belgium: "photo-1491557345352-5929e343eb89",
}

export const EDITORIAL_IMAGES = {
  kasbah: "photo-1489749798305-4fea3ae63d43",
  zellige: "photo-1539020140153-e479b8c22e70",
} as const

export function unsplash(id: string, size = 1600): string {
  return `https://images.unsplash.com/${id}?w=${size}&auto=format&fit=crop&q=80`
}

const CATEGORY_COVERS: Record<string, string> = {
  adventure: "photo-1464822759023-fed622ff2c3b",
  wellness: "photo-1545389336-cf090694435e",
  culture: "photo-1539020140153-e479b8c22e70",
  culinary: "photo-1504674900247-0877df9cc836",
  water: "photo-1502680390469-be75c86b636f",
  aerial: "photo-1483683804023-6ccdb62f86ef",
}

export function getCategoryCover(category: string, size = 800): string {
  return unsplash(CATEGORY_COVERS[category] ?? pool.default[0], size)
}

export function getDestinationImage(country: string, size = 1600): string {
  return unsplash(DESTINATIONS[country] ?? pool.default[0], size)
}

function slugHash(slug: string): number {
  return slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function getPoolImage(categoryOrType: string, slug: string, size = 1200): string {
  const key = categoryOrType?.toLowerCase() ?? "default"
  const images = pool[key] ?? pool.default
  const id = images[slugHash(slug) % images.length]
  return `https://images.unsplash.com/${id}?w=${size}&auto=format&fit=crop&q=80`
}
