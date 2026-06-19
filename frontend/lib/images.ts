// Curated Unsplash photo IDs by category/type.
// Cards call getPoolImage(category, slug) for a consistent-but-varied image
// when the item has no images stored in the DB yet.

const pool: Record<string, string[]> = {
  adventure: [
    "photo-1464822759023-fed622ff2c3b", // mountain ridge
    "photo-1502680390469-be75c86b636f", // surfing
    "photo-1483683804023-6ccdb62f86ef", // skydiving
    "photo-1544551763-46a013bb70d5", // scuba diving
    "photo-1507525428034-b723cf961d3e", // tropical beach
    "photo-1509316785289-025f5b846b35", // sahara dunes
    "photo-1558769132-cb1aea458c5e", // cycling mountains
    "photo-1551632436-cbf8dd35adfa", // hiking trail
  ],
  wellness: [
    "photo-1545389336-cf090694435e", // yoga on cliff
    "photo-1571019613454-1cb2f99b2d8b", // spa treatment
    "photo-1506126613408-eca07ce68773", // outdoor meditation
    "photo-1518611012118-696072aa579a", // yoga studio
    "photo-1600334129128-685c5582fd35", // hot spring
    "photo-1599901860904-17e6ed7083a0", // wellness retreat
  ],
  culture: [
    "photo-1565193566173-7a0ee3dbe261", // pottery
    "photo-1539037116277-4db20889f2d4", // historic alley
    "photo-1555396273-367ea4eb4db5", // food market
    "photo-1558618666-fcd25c85cd64", // architecture detail
    "photo-1568393691622-c7ba131d1b16", // temple japan
    "photo-1519677584237-752f8853252e", // european square
    "photo-1581351721010-8cf859cb14a4", // museum gallery
  ],
  culinary: [
    "photo-1556909114-f6e7ad7d3136", // cooking class
    "photo-1414235077428-338989a2e8c0", // gourmet plate
    "photo-1510812431401-41d2bd2722f3", // wine tasting
    "photo-1517248135467-4c7edcad34c4", // restaurant interior
    "photo-1504674900247-0877df9cc836", // food spread
    "photo-1565958011703-44f9829ba187", // street food
  ],
  water: [
    "photo-1507525428034-b723cf961d3e", // beach
    "photo-1544551763-46a013bb70d5", // diving
    "photo-1502680390469-be75c86b636f", // surfing
    "photo-1519046904884-53103b34b206", // sailing
    "photo-1567899378494-47b22a2ae96a", // kayaking
  ],
  aerial: [
    "photo-1483683804023-6ccdb62f86ef", // skydiving
    "photo-1540039155733-5bb30b53aa14", // hot air balloon
    "photo-1473621038790-b778b4750efe", // paragliding
  ],
  // property types
  riad: [
    "photo-1582719508461-905c673771fd", // riad courtyard
    "photo-1601628828688-632f38a5a7d0", // moroccan interior
  ],
  villa: [
    "photo-1566073771259-6a8506099945", // infinity pool villa
    "photo-1613490493576-4196e2f1a788", // modern villa
    "photo-1520250497591-112f2f40a3f4", // villa terrace
  ],
  apartment: [
    "photo-1522708323590-d24dbb6b0267", // paris apartment
    "photo-1502672260266-1c1ef2d93688", // studio loft
  ],
  gite: [
    "photo-1449158743715-0a90ebb6d2d8", // mountain chalet
    "photo-1510798831971-661eb04b3739", // countryside cottage
  ],
  hotel: [
    "photo-1551882547-ff40c63fe5fa", // boutique hotel lobby
    "photo-1618773928121-c32242e63f39", // hotel room sea view
  ],
  bivouac: [
    "photo-1509316785289-025f5b846b35", // sahara dunes night
    "photo-1537225228614-56cc3556d7ed", // desert camp
  ],
  ryokan: [
    "photo-1528360983277-13d401cdc186", // japanese inn
    "photo-1480796927426-f609979314bd", // kyoto garden
  ],
  default: [
    "photo-1476514525535-07fb3b4ae5f1", // travel scenic
    "photo-1500835556837-99ac94a94552", // world travel
    "photo-1488085061387-422e29b40080", // destinations
    "photo-1530521954074-e64f6810b32d", // adventure travel
  ],
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
