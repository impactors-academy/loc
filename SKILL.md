---
name: loc
description: Use this skill when building, extending, or making decisions about the LOC tourism platform. Triggers on any task related to LOC features, pages, components, revenue streams, backend logic, or content strategy. Also triggers when the user mentions tourists, listings, experiences, destinations, countries, or digital products in the context of this project.
---

## Project Overview

LOC is a **global digital tourism connector and media brand** operating under Impactor's Academy. It started focused on Morocco and France and has expanded to a worldwide platform covering Japan, France, UK, Belgium, Bali, Greece, Italy, Morocco, and beyond. It is transitioning from a direct short-term rental operator into a scalable tourism-tech platform.

The platform connects tourists with:
- **Experience providers** (adventure, culinary, wellness, cultural, water, aerial experiences worldwide)
- **Property owners** (apartments, villas, riads, ryokans, gîtes, hotels, bivouacs)
- **Digital products** (travel guides, destination itineraries, video courses, experience maps)

LOC earns revenue through referral commissions, featured placements, sponsored promotions, affiliate partnerships, and digital product sales — not by owning or operating properties directly.

## Tech Stack

- **Frontend:** Next.js 15.3 App Router · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query v5 · framer-motion v12
- **Backend:** Python 3.11+ · FastAPI · uv · Uvicorn · Pydantic v2 · python-dotenv
- **Caching:** Redis · `fastapi-cache2` (service-layer response caching, TTL 5m)
- **Database:** PostgreSQL 16 · SQLAlchemy 2 · Alembic · psycopg2-binary · **pgvector** (hybrid search)
- **Search:** Phase 1 — Postgres FTS + pg_trgm · Phase 2 (live) — pgvector cosine + RRF hybrid
- **API:** RESTful, versioned `/api/v1/`, CORS to Next.js origin
- **Deployment:** Vercel (frontend) · Railway (backend + PostgreSQL + Redis)
- **Repo structure:**
  - `frontend/` — Next.js app
  - `backend/` — FastAPI app (`main.py`, `api/`, `models/`, `schemas/`, `repositories/`, `services/`, `db/`)
- **Branches:** `develope` = active development · `main` = production-stable

## Brand Palette

| Token | Hex | Use |
|---|---|---|
| `loc-terracotta` | `#C4714A` | Primary CTA, category badges |
| `loc-sand` | `#F7EDD8` | Background highlights, stat strips |
| `loc-amber` | `#D4A44C` | Accents, featured badges, typewriter cursor |
| `loc-teal` | `#2D6A6A` | Secondary accent |
| `loc-night` | `#1A1A2E` | Dark backgrounds, text |
| `loc-stone` | `#8B7355` | Muted text, subtitles |

## Core Platform Features (Priority Order)

### 1. Tourism Experience Discovery
Pages and components that let tourists browse and filter global experiences by category and country. Each listing shows provider info, pricing, duration, country/location, and a referral/inquiry CTA. LOC earns a commission on referrals — no booking engine, lead generation only.

**Supported categories:** `adventure` · `wellness` · `culture` · `culinary` · `water` · `aerial`

### 2. Property Listings
A global directory of stays where landlords/hosts pay for visibility. Each card links to a contact/inquiry form — not a direct booking system.

**Supported types:** `villa` · `apartment` · `riad` · `ryokan` · `gite` · `hotel` · `bivouac`

### 3. Digital Product Store
A simple storefront for downloadable products:
- World travel guides (PDF/eBook)
- Destination itinerary packs
- Video travel masterclasses
- Local experience maps
- Photography/content packs

### 4. Tourism Media / Content Hub
A blog showcasing travel content, hidden destinations, and destination guides. Builds audience trust and SEO. Related articles powered by pgvector cosine similarity.

### 5. Business Promotion Packages
A landing page for tourism businesses to inquire about sponsored placements, social media promotions, and content packages. Flat monthly fees — no booking commissions.

## Global Expansion Model

LOC is destination-agnostic. Each entity (`Experience`, `Property`) carries a `country` field. The seed and UI support filtering by country/destination. The discovery layer (R4) adds:
- **Homepage hero search bar** routing to `/experiences?q=...`
- **Popular Destinations** section with photo cards per country
- **Country filter** in `ExperienceFilters` and `PropertyFilters`
- **Destination pages** `/destinations/[country]` (future)

### GetYourGuide-inspired patterns (adopted selectively)

| Pattern | Adopted | Reason |
|---|---|---|
| Search bar in hero | ✅ R4 | Intent-first discovery |
| Destination browsing cards | ✅ R4 | Country-based navigation |
| Duration on cards | ✅ R4 | Quick mental filter |
| Country badge on cards | ✅ R4 | Makes global scope tangible |
| Star ratings + reviews | ❌ | No review engine planned |
| Instant booking / checkout | ❌ | LOC = lead-gen, not transactions |
| "Likely to sell out" urgency | ❌ | Dark pattern, off-brand |

## Release History

| Release | Status | What shipped |
|---|---|---|
| **R0 — Foundation** | ✅ Done | Docker stack, Alembic, models, CI skeleton |
| **R1 — Core platform** | ✅ Done | Experiences/stays/store/blog pages, inquiry form, referral CTAs |
| **R2 — Monetisation** | ✅ Done | Digital store, blog, promote page, FTS search, featured tiers |
| **R3 — Discovery & scale** | ✅ Done | pgvector hybrid search (RRF), related articles, product POST API, seed, CI green |
| **Global pivot** | ✅ Done | `country` field, global seed (10 countries), image pool, global copy, typewriter hero |
| **R4 — GYG-inspired discovery** | 🔵 Next | Hero search, destination cards, country filters, duration on cards |

## Data Model Summary (current)

### experiences
`id · slug · title · description · category · country · location · duration · price_min · price_max · images(JSONB) · is_featured · provider_name · provider_contact · referral_url · embedding(vector 1536) · search_vector(tsvector)`

### properties
`id · slug · title · description · type · country · location · price_min · price_max · images(JSONB) · listing_tier · owner_contact`

### products
`id · slug · title · description · type · price · image_url · purchase_url`

### blog_posts
`id · slug · title · excerpt · content · image_url · tags(str comma-sep) · published_at · embedding(vector 1536)`

### inquiries
`id · name · email · phone · message · subject · source_type · source_id · created_at`

## Revenue Model

| Feature | Revenue model |
|---|---|
| Experience listings | Referral commission per booking |
| Property listings | Monthly subscription or per-lead fee |
| Sponsored placements | One-time or recurring ad fee |
| Digital products | Direct sale (PDF/eBook/course) |
| Affiliate links | Commission on external purchases |
| Content/media | Sponsored posts, brand partnerships |

**Never build a payment/checkout system** — use Gumroad/Lemon Squeezy for digital products; experiences/properties use inquiry + referral links.

## Development Principles

- Mobile-first, then scale up — tourists browse on phones
- Keep it lean — avoid over-engineering, small team
- Use shadcn/ui as the base UI layer; extend with Tailwind
- Every page must have a clear CTA connected to a revenue stream
- Ask: *"Does this help a tourist discover something, or help a business get clients?"* If neither, deprioritise
- Dependency flow: `endpoints → services → repositories → models` — never skip or reverse
- Cache at the **service layer** using `@cache()` — not on endpoints; invalidate on write
- All API calls through `lib/api.ts`; all server-state through TanStack Query hooks — no raw `fetch()` in components

## File Structure Conventions

### Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Homepage (typewriter hero, destination grid, featured cards)
│   │   ├── experiences/          # /experiences list + [slug] detail
│   │   ├── stays/                # /stays list + [slug] detail
│   │   ├── blog/                 # /blog list + [slug] article
│   │   ├── promote/              # /promote business packages
│   │   └── layout.tsx            # Navbar + Footer
│   ├── (store)/
│   │   ├── store/page.tsx        # /store product grid
│   │   └── products/[slug]/      # /products/[slug] detail + buy CTA
│   ├── (dashboard)/              # Future: partner/admin (auth-gated)
│   ├── api/contact/route.ts      # Inquiry proxy → FastAPI
│   ├── layout.tsx                # Root layout (fonts, providers, schema.org)
│   └── globals.css               # Tailwind base + CSS vars + @keyframes blink
│
├── components/
│   ├── ui/                       # shadcn/ui primitives — never hand-edit
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx       # Accepts animated prop → renders TypewriterTitle
│   │   ├── TypewriterTitle.tsx   # Client component: cycles destinations, lands on "the World"
│   │   ├── SectionHeader.tsx
│   │   └── InquiryForm.tsx
│   └── features/
│       ├── experiences/          # ExperienceCard · ExperienceGrid · ExperienceFilters
│       ├── stays/                # PropertyCard · PropertyGrid · PropertyFilters
│       ├── store/                # ProductCard · ProductGrid
│       └── blog/                 # ArticleCard · ArticleGrid · RelatedArticles
│
├── lib/
│   ├── api.ts                    # Centralised fetch wrapper
│   ├── images.ts                 # Unsplash pool by category/type + slug-hash picker
│   ├── query-client.ts           # TanStack QueryClient (staleTime 5m)
│   ├── types.ts                  # Experience · Property · Product · BlogPost · etc.
│   ├── utils.ts                  # cn() helper
│   └── constants.ts              # EXPERIENCE_CATEGORIES · PROPERTY_TYPES · NAV_LINKS · QUERY_KEYS · SITE_NAME
│
└── hooks/
    ├── useExperiences.ts
    ├── useProperties.ts
    ├── useProducts.ts
    └── useBlogPosts.ts
```

### Backend (`backend/`)

Strict layered architecture: `endpoints → services → repositories → models`

```
backend/app/
├── api/v1/endpoints/   # HTTP only: parse, call service, return schema
├── services/           # Business logic: orchestrate repos, cache, notify
├── repositories/       # SQLAlchemy queries only — no business rules
├── models/             # ORM table definitions
├── schemas/            # Pydantic *Create/*Read/*Update per model
├── db/session.py       # Engine + SessionLocal + get_db()
└── core/deps.py        # Shared FastAPI deps
```

Alembic migrations live in `backend/alembic/versions/` — every model change requires a migration in the same PR.

## What to Avoid

- Full payment/checkout — external links only (Gumroad/Lemon Squeezy)
- User authentication in Phase 1 — public platform first
- Replicating Airbnb — no booking management, only lead generation
- Admin dashboards before the public platform is live
- Standalone vector DB (Pinecone/Weaviate) — Postgres + pgvector is sufficient at this scale
- Raw `fetch()` in components — always go through `lib/api.ts` + a TanStack Query hook
- Inline query key strings — always use `QUERY_KEYS.*` from `constants.ts`
