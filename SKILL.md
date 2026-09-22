---
name: loc
description: Use this skill when building, extending, or making decisions about the LOC tourism platform. Triggers on any task related to LOC features, pages, components, revenue streams, backend logic, or content strategy. Also triggers when the user mentions tourists, listings, experiences, destinations, countries, or digital products in the context of this project.
---

## Project Overview

LOC is a **global travel technology platform** operating under Impactor's Academy. It started as a short-term rental operator in Morocco and France and is evolving into a scalable marketplace that connects travellers with accommodation, experiences, transport, restaurants, and local businesses across multiple countries.

**The model shift:** Traditional travel agencies are agency models (Customer → LOC team → Supplier → Customer) that cap at operational capacity. LOC is building toward a marketplace model (Customer → LOC Platform → Supplier) where technology handles discovery, trust, and transaction while suppliers deliver the service.

**Current stage:** Stage 1 (Directory & Discovery) — suppliers listed and searchable; no automated booking yet. Admin CRUD dashboard live for content management.

**Geographic sequencing:** Morocco → France → Belgium first (diaspora density, language advantage, flight flows). Expand only after Stage 3 automation is proven.

The platform connects travellers with:
- **Experience providers** (adventure, culinary, wellness, cultural, water, aerial experiences worldwide)
- **Property owners** (apartments, villas, riads, ryokans, gîtes, hotels, bivouacs)
- **Digital products** (travel guides, destination itineraries, video courses, experience maps)

## Strategic Roadmap (Stage-Gated)

Each stage requires a defined revenue or automation milestone before moving to the next.

| Stage | Focus | Exit Criteria |
|---|---|---|
| **1 — Directory & Discovery** *(current)* | Suppliers listed, searchable, browsable | Organic traffic + first affiliate/lead revenue |
| **2 — Lead Gen & Affiliate** | Automated lead capture + affiliate commissions | First revenue generated with zero delivery ops |
| **3 — Direct Booking Integration** | Customers book without human involvement | Confirmed booking volume without manual intervention |
| **4 — Full Marketplace** | Automated payments, commission capture at scale | Commission flowing automatically at scale |
| **5 — AI-Driven Personalisation** | Recommendations, trip planning as the moat | Personalisation measurably improves conversion |

**Key principle:** Technology infrastructure before hiring. Operations teams scale linearly; platforms scale exponentially.

## Tech Stack

- **Frontend:** Next.js 15.3 App Router · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query v5 · framer-motion v12
- **Backend:** Python 3.11+ · FastAPI · uv · Uvicorn · Pydantic v2 · python-dotenv
- **Caching:** Redis · `fastapi-cache2` (service-layer response caching, TTL 5m)
- **Database:** PostgreSQL 16 · SQLAlchemy 2 · Alembic · psycopg2-binary · **pgvector** (hybrid search)
- **Search:** Pure Postgres FTS (`tsvector`) + pgvector cosine RRF hybrid
- **API:** RESTful, versioned `/api/v1/`, CORS to Next.js origin
- **Deployment:** Hostinger VPS via Coolify · DNS on Cloudflare · `docker-compose.coolify.yml`
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
Pages and components that let tourists browse and filter global experiences by category and country. Each listing shows provider info, pricing, duration, country/location, and a referral/inquiry CTA. LOC earns a commission on referrals — no booking engine at Stage 1.

**Supported categories:** `adventure` · `wellness` · `culture` · `culinary` · `water` · `aerial`

### 2. Property Listings
A global directory of stays where landlords/hosts pay for visibility. Each card links to a contact/inquiry form — not a direct booking system at Stage 1.

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
A landing page for tourism businesses to inquire about sponsored placements, social media promotions, and content packages. Flat monthly fees — no booking commissions at Stage 1.

### 6. Admin Dashboard (`/dashboard`)
Internal CRUD interface for LOC editors. Full create/update/delete for Experiences, Properties, Blog Posts, and Products. Read-only Inquiries view. No authentication yet — restrict by deployment environment until auth is added at Stage 3.

## Global Expansion Model

LOC is destination-agnostic. Each entity (`Experience`, `Property`) carries a `country` field. The discovery layer adds:
- **Homepage hero search bar** routing to `/experiences?q=...`
- **Popular Destinations** section with photo cards per country
- **Country filter** in `ExperienceFilters` and `PropertyFilters`
- **Destination pages** `/destinations/[country]` with curated hero + tabbed listings

### GetYourGuide/Tripadvisor patterns (adopted selectively)

| Pattern | Adopted | Stage | Reason |
|---|---|---|---|
| Search bar in hero | ✅ | S1 | Intent-first discovery |
| Destination browsing cards | ✅ | S1 | Country-based navigation |
| Duration on cards | ✅ | S1 | Quick mental filter |
| Country badge on cards | ✅ | S1 | Makes global scope tangible |
| Commission-based revenue | ✅ | S3 | Core marketplace mechanic — target Stage 3 |
| Featured listings / subscriptions | ✅ | S1–S2 | Supplier-funded visibility now |
| Affiliate commissions | ✅ | S2 | Flights, insurance, car rentals |
| Automated payment & payout | ⬜ | S4 | Deferred; requires booking infra first |
| Star ratings + reviews | ❌ | — | No review engine planned (complexity vs. value at this scale) |
| "Likely to sell out" urgency | ❌ | — | Dark pattern, off-brand |

## Release History

| Release | Status | What shipped |
|---|---|---|
| **R0 — Foundation** | ✅ Done | Docker stack, Alembic, models, CI skeleton |
| **R1 — Core platform** | ✅ Done | Experiences/stays/store/blog pages, inquiry form, referral CTAs |
| **R2 — Monetisation** | ✅ Done | Digital store, blog, promote page, FTS search, featured tiers |
| **R3 — Discovery & scale** | ✅ Done | pgvector hybrid search (RRF), related articles, product POST API, seed, CI green |
| **Global pivot** | ✅ Done | `country` field, global seed (10 countries), image pool, global copy, typewriter hero |
| **R4 — GYG-inspired discovery** | ✅ Done | Hero search, destination cards, country filters, duration on cards, destination pages `/destinations/[country]` |
| **Admin dashboard** | ✅ Done | `/dashboard` with full CRUD for all content types + inquiries view |
| **R5 — Booking automation** | ⬜ Next | Supplier self-onboarding, availability, first booking flow (Stage 2→3 gate) |

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

| Feature | Revenue model | Stage |
|---|---|---|
| Experience referral CTAs | Commission on outbound referrals | S1 now |
| Property listings | Monthly subscription or per-lead fee | S1 now |
| Sponsored/featured placements | One-time or recurring ad fee | S1 now |
| Digital products | Direct sale (PDF/eBook/course) via Gumroad/Lemon Squeezy | S1 now |
| Affiliate links | Commission on external purchases (flights, insurance, car rentals) | S2 |
| Direct booking commissions | 15–25% commission on confirmed accommodation/experience bookings | S3 |
| Supplier dashboard subscriptions | Monthly SaaS fee for analytics + booking management tools | S3–S4 |
| Advertising | Supplier-funded visibility to active travellers | S2–S3 |

**Stage 1 constraint:** No payment/checkout system — external links only (Gumroad/Lemon Squeezy for products; inquiry + referral links for experiences/properties).

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
│   │   ├── destinations/[country]/  # /destinations/[country] hero + tabbed listings
│   │   ├── promote/              # /promote business packages
│   │   └── layout.tsx            # Navbar + Footer
│   ├── (store)/
│   │   ├── store/page.tsx        # /store product grid
│   │   └── products/[slug]/      # /products/[slug] detail + buy CTA
│   ├── (admin)/
│   │   ├── _components/Sidebar.tsx
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx          # Overview stats
│   │       ├── experiences/      # list · new · [slug]/edit
│   │       ├── properties/       # list · new · [slug]/edit
│   │       ├── blog/             # list · new · [slug]/edit
│   │       ├── products/         # list · new · [slug]/edit
│   │       └── inquiries/        # read-only leads table
│   ├── api/
│   │   ├── admin/[...path]/route.ts  # Admin proxy → FastAPI (attaches EDITOR_API_KEY)
│   │   └── contact/route.ts          # Inquiry proxy → FastAPI
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
│       ├── destinations/         # DestinationTabs
│       ├── store/                # ProductCard · ProductGrid
│       └── blog/                 # ArticleCard · ArticleGrid · RelatedArticles
│
├── lib/
│   ├── api.ts                    # Centralised fetch wrapper + admin namespace
│   ├── images.ts                 # Unsplash pool by category/type + slug-hash picker
│   ├── destinations.ts           # DESTINATIONS_META array + DESTINATION_BY_COUNTRY lookup
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

- Payment/checkout at Stage 1 — external links only (Gumroad/Lemon Squeezy); booking infra deferred to Stage 3
- User authentication before booking automation is proven — public platform first; auth gates supplier self-service at Stage 3
- Replicating Airbnb — no booking management until Stage 3; Stage 1 is lead generation + referral
- Geographic expansion before Stage 3 automation — expanding to new markets while manual ops dominate just multiplies the bottleneck
- Standalone vector DB (Pinecone/Weaviate) — Postgres + pgvector is sufficient at this scale
- Raw `fetch()` in components — always go through `lib/api.ts` + a TanStack Query hook
- Inline query key strings — always use `QUERY_KEYS.*` from `constants.ts`
- Trigram (`%%`) operator in raw SQLAlchemy — use pure FTS (`tsvector`) instead; pg_trgm causes type mismatch with psycopg2 bound params
