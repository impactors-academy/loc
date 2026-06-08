---
name: loc
description: Use this skill when building, extending, or making decisions about the LOC tourism platform. Triggers on any task related to LOC features, pages, components, revenue streams, backend logic, or content strategy. Also triggers when the user mentions tourists, listings, experiences, commissions, Morocco, or digital products in the context of this project.
---

## Project Overview

LOC is a **digital tourism connector and media brand** operating under Impactor's Academy, focused on Morocco (and France). It is transitioning from a direct short-term rental operator into a scalable tourism-tech platform.

The platform connects tourists with:
- **Experience providers** (quad biking, desert tours, skydiving, hot air balloons, boat trips, wellness)
- **Property owners** (apartments, villas, vacation homes, local stays)
- **Digital products** (travel guides, experience maps, relocation guides, content packs)

LOC earns revenue through referral commissions, featured placements, sponsored promotions, affiliate partnerships, and digital product sales — not by owning or operating properties directly.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query v5 (server-state caching + background refetch)
- **Backend:** Python 3.11+ · FastAPI · uv · Uvicorn (ASGI server) · Pydantic v2 (validation) · python-dotenv (env management)
- **Caching:** Redis · `fastapi-cache2` (response-level caching on the FastAPI side) — keeps repeated listing/experience queries off the DB entirely
- **Database:** PostgreSQL (local dev) · SQLAlchemy (ORM) · Alembic (migrations) · psycopg2-binary (driver) — with plans to migrate to managed hosting (e.g. Supabase or Railway) and add auth in a later phase
- **API design:** RESTful, versioned under `/api/v1/`, CORS configured to allow the Next.js frontend origin
- **Repo structure:**
  - `frontend/` — Next.js app
  - `backend/` — FastAPI app (`main.py` entrypoint, `api/`, `models/`, `schemas/`, `repositories/`, `services/`, `db/`)
- **Branch:** `develope` is the active development branch; `main` is production-stable

## Core Platform Features (Priority Order)

### 1. Tourism Experience Discovery
Pages and components that let tourists browse and filter experiences by category (adventure, wellness, cultural, etc.). Each listing shows provider info, pricing range, and a referral/inquiry CTA. LOC earns a commission on referrals — do not build a full booking engine, just lead generation.

### 2. Property Listings
A directory of stays (apartments, villas, vacation homes) where landlords pay for visibility. Build as a listing card grid with filters (location, type, price range). Each card links to a contact/inquiry form — not a direct booking system.

### 3. Digital Product Store
A simple storefront for downloadable products:
- Morocco & France travel guides (PDF/eBook)
- Local experience maps (Notion templates or PDF)
- Relocation & remote worker guides
- Tourism photography/content packs

### 4. Tourism Media / Content Hub
A blog or video feed showcasing travel content, hidden destinations, and experience reviews. This builds audience trust and SEO. Connect to social media (Instagram Reels, TikTok embeds where possible).

### 5. Business Promotion Packages
A landing page for tourism businesses to inquire about sponsored placements, social media promotions, and content packages.

## Brand & Design Direction

LOC positions itself around these themes: **Discovery, Adventure, Lifestyle, Luxury experiences, Authentic Moroccan tourism, Convenience, Community.**

Design guidelines:
- Clean, modern, tourism-forward aesthetic
- Mobile-first (tourists browse on phones)
- Use warm earthy tones + vibrant accent colors that evoke Morocco (terracotta, sand, deep blue)
- High-quality imagery is central — always reserve prominent space for hero images and experience photos
- Avoid cluttered layouts; prioritize whitespace and clear CTAs

## Revenue Model — Keep in Mind

When building any feature, consider how it connects to a revenue stream:

| Feature | Revenue model |
|---|---|
| Experience listings | Referral commission per booking |
| Property listings | Monthly subscription or per-lead fee |
| Sponsored placements | One-time or recurring ad fee |
| Digital products | Direct sale (PDF/eBook) |
| Affiliate links | Commission on external purchases |
| Content/media | Sponsored posts, brand partnerships |

Never build a complex booking engine — LOC's model is lead generation and referral, not transaction processing.

## Development Principles

- Build pages and components that work on mobile first, then scale up
- Keep the codebase simple — this is a lean team; avoid over-engineering
- Use shadcn/ui components as the base UI layer; extend with Tailwind
- Every page should have a clear CTA that connects to a revenue stream (inquiry form, product purchase, referral link)
- For any new feature, ask: "Does this help a tourist discover something, or help a business get clients?" If neither, deprioritize it

## File Structure Conventions

### Frontend (`frontend/`)

```
frontend/
├── app/                          # Next.js App Router root
│   ├── (marketing)/              # Public-facing route group (no shared layout with store)
│   │   ├── page.tsx              # Homepage
│   │   ├── experiences/
│   │   │   ├── page.tsx          # Experience discovery listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual experience detail
│   │   ├── stays/
│   │   │   ├── page.tsx          # Property listings
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual property detail
│   │   ├── blog/
│   │   │   ├── page.tsx          # Tourism content hub
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual article/video
│   │   ├── promote/
│   │   │   └── page.tsx          # Business promotion packages CTA
│   │   └── layout.tsx            # Marketing layout (Navbar + Footer)
│   ├── (store)/                  # Digital product store route group
│   │   ├── store/
│   │   │   └── page.tsx          # Store homepage → /store (avoids conflict with marketing /)
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail + purchase link → /products/[slug]
│   │   └── layout.tsx            # Store layout (minimal, focused)
│   ├── (dashboard)/              # Future: partner/admin dashboard (auth-gated)
│   │   └── layout.tsx
│   ├── api/                      # Next.js API routes (lightweight only — proxy to FastAPI)
│   │   └── contact/
│   │       └── route.ts          # Contact/inquiry form handler
│   ├── layout.tsx                # Root layout (fonts, QueryClientProvider, global providers)
│   └── globals.css               # Tailwind base styles + CSS variables
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (auto-generated, do not hand-edit)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── shared/                   # Reusable layout and global components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx       # Reusable hero banner with image + CTA
│   │   ├── SectionHeader.tsx     # Consistent section title + subtitle block
│   │   └── InquiryForm.tsx       # Shared contact/inquiry modal or section
│   └── features/                 # Feature-specific components (colocated with their domain)
│       ├── experiences/
│       │   ├── ExperienceCard.tsx
│       │   ├── ExperienceGrid.tsx
│       │   └── ExperienceFilters.tsx
│       ├── stays/
│       │   ├── PropertyCard.tsx
│       │   ├── PropertyGrid.tsx
│       │   └── PropertyFilters.tsx
│       ├── store/
│       │   ├── ProductCard.tsx
│       │   └── ProductGrid.tsx
│       └── blog/
│           ├── ArticleCard.tsx
│           └── ArticleGrid.tsx
│
├── lib/
│   ├── api.ts                    # Centralized fetch wrapper for FastAPI calls (used by hooks)
│   ├── query-client.ts           # TanStack QueryClient singleton with global staleTime/gcTime
│   ├── types.ts                  # Shared TypeScript types (Experience, Property, Product, etc.)
│   ├── utils.ts                  # shadcn cn() helper + general utilities
│   └── constants.ts              # Site-wide constants (categories, nav links, query keys)
│
├── hooks/                        # TanStack Query hooks — one file per domain
│   ├── useExperiences.ts         # useExperiences(), useExperience(slug)
│   ├── useProperties.ts          # useProperties(), useProperty(slug)
│   ├── useProducts.ts            # useProducts(), useProduct(slug)
│   └── useBlogPosts.ts           # useBlogPosts(), useBlogPost(slug)
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── components.json               # shadcn/ui config
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

**Key rules:**
- `components/ui/` is owned by shadcn — never hand-edit these files; re-run `npx shadcn add` to update
- `components/shared/` is for anything used across 2+ pages or route groups
- `components/features/` is domain-scoped — an experience component lives in `features/experiences/`, not at the root
- All API calls go through `lib/api.ts`; no raw `fetch()` calls scattered in components or hooks
- Types are defined once in `lib/types.ts` and imported everywhere
- Query keys are defined as constants in `lib/constants.ts` (e.g. `QUERY_KEYS.experiences`) — never use inline strings as query keys
- All server-state (API data) is managed by TanStack Query hooks in `hooks/`; no `useState` + `useEffect` for fetching
- Set `staleTime: 1000 * 60 * 5` (5 min) globally in `lib/query-client.ts` — data stays fresh client-side while Redis handles freshness server-side
- Components never call `lib/api.ts` directly — they call a hook, which calls `lib/api.ts`

---

### Backend (`backend/`)

```
backend/
├── app/
│   ├── main.py                   # FastAPI app entry point; registers routers, CORS, lifespan
│   ├── config.py                 # Settings loaded from .env via pydantic-settings
│   │
│   ├── api/
│   │   └── v1/                   # Version 1 of the API (all routes live here)
│   │       ├── __init__.py
│   │       ├── router.py         # Aggregates all v1 sub-routers into one prefix `/api/v1`
│   │       └── endpoints/        # One file per domain
│   │           ├── experiences.py
│   │           ├── properties.py
│   │           ├── products.py
│   │           ├── blog.py
│   │           └── contact.py
│   │
│   ├── models/                   # SQLAlchemy ORM models (database table definitions)
│   │   ├── __init__.py
│   │   ├── base.py               # Base declarative class shared by all models
│   │   ├── experience.py
│   │   ├── property.py
│   │   ├── product.py
│   │   └── blog_post.py
│   │
│   ├── schemas/                  # Pydantic schemas (request/response validation)
│   │   ├── __init__.py
│   │   ├── experience.py         # ExperienceCreate, ExperienceRead, ExperienceUpdate
│   │   ├── property.py
│   │   ├── product.py
│   │   └── blog_post.py
│   │
│   ├── repositories/             # Data access only — all SQLAlchemy queries live here, nothing else
│   │   ├── __init__.py
│   │   ├── base.py               # Generic BaseRepository with get, get_multi, create, update, delete
│   │   ├── experience.py         # Extends BaseRepository: filter_by_category, get_by_slug, etc.
│   │   ├── property.py
│   │   ├── product.py
│   │   └── blog_post.py
│   │
│   ├── services/                 # Business logic — orchestrates repositories, applies rules
│   │   ├── __init__.py
│   │   ├── experience.py         # get_featured_experiences(), handle_referral_inquiry()
│   │   ├── property.py           # get_available_stays(), calculate_lead_fee()
│   │   ├── product.py            # get_store_listings(), process_purchase_redirect()
│   │   ├── blog_post.py          # get_published_articles(), get_by_tag()
│   │   └── contact.py            # handle_inquiry(), notify_partner()
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py            # SQLAlchemy engine + SessionLocal + get_db() dependency
│   │   └── init_db.py            # Creates tables on startup (dev only)
│   │
│   └── core/
│       ├── __init__.py
│       └── deps.py               # Shared FastAPI dependencies (get_db, pagination params, etc.)
│
├── alembic/                      # Database migration history
│   ├── env.py
│   ├── script.py.mako
│   └── versions/                 # Auto-generated migration files
│
├── tests/
│   ├── conftest.py               # Shared pytest fixtures (test DB, test client)
│   └── api/
│       └── v1/
│           ├── test_experiences.py
│           └── test_properties.py
│
├── .env                          # Local env vars (never commit)
├── .env.example                  # Committed template with placeholder values
├── alembic.ini
├── pyproject.toml                # Project metadata + dependencies (managed with uv)
└── requirements.txt              # Pinned lockfile export for deployment
```

**Key rules:**
- Dependency flow is strictly one-way: `endpoints` → `services` → `repositories` → `models` — never skip or reverse a layer
- Cache at the **service layer** using `fastapi-cache2` `@cache()` decorator — not on endpoints, not on repositories; services own the caching decision
- Default TTL for public listing endpoints (experiences, properties, blog): 5 minutes — matches frontend `staleTime` so both layers stay in sync
- Use cache key namespacing by domain: `experiences:{slug}`, `properties:list`, `blog:{slug}` — avoids key collisions across services
- On any create/update/delete operation, invalidate the relevant cache keys in the same service method — never leave stale data after a write
- Endpoints handle HTTP only: parse the request, call a service, return a response — no DB access, no business logic inline
- Services handle business logic only: they call repositories for data, apply rules, and return domain results — no raw SQLAlchemy queries
- Repositories handle data access only: all SQLAlchemy queries live here — no business rules, no HTTP concerns
- `repositories/base.py` provides a `BaseRepository` generic class; domain repositories inherit from it and only add domain-specific queries
- `schemas/` mirrors `models/` but is separate — ORM models are never exposed directly to the API; always pass through a Pydantic schema
- Add a `v2/` folder under `api/` when breaking changes are needed; `v1/` stays frozen and continues to work
- `.env` is gitignored; `.env.example` is always kept up to date when a new variable is added

## What to Avoid

- Do not build a full payment/checkout system yet — use Gumroad or a simple link for digital products initially
- Do not build user authentication in the first phase — focus on the public-facing platform
- Do not replicate Airbnb — LOC does not manage bookings; it generates leads and earns commissions
- Do not over-invest in admin dashboards before the public platform is live