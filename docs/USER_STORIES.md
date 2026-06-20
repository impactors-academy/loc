# LOC — Product Backlog (User Stories)

Written as Product Owner. Grounded in the LOC brief and skill: a **global** tourism **connector + media brand** that earns through referrals, leads, sponsored placements, and digital product sales — **not** bookings or checkout.

**Personas**
- **Tourist** — traveller discovering experiences/stays/content (mobile-first, global).
- **Provider** — experience/activity business wanting clients.
- **Landlord/Host** — property owner wanting visibility and leads.
- **Advertiser** — tourism business buying sponsored placement/content.
- **Editor** — LOC team member publishing content and managing listings.

**Priority:** P0 = launch-critical · P1 = fast-follow · P2 = later phase.
**Story IDs** are referenced by branches/PRs (e.g. `feature/EXP-2`).

---

## Release Status

| Release | Status | What shipped |
|---|---|---|
| **R0 — Foundation** | ✅ Done | Docker stack, Alembic, models, CI skeleton |
| **R1 — Core platform** | ✅ Done | Experiences/stays/store/blog, inquiry form, referral CTAs |
| **R2 — Monetisation** | ✅ Done | Digital store, blog, promote page, FTS search, featured tiers |
| **R3 — Discovery & scale** | ✅ Done | pgvector hybrid search (RRF), related articles (vector), product POST API, global seed, CI green |
| **Global pivot** | ✅ Done | `country` field on experiences+properties, global seed (10 destinations), Unsplash image pool, all copy globalised, typewriter hero |
| **R4 — GYG-inspired discovery** | 🔵 Active | Hero search, popular destinations, country filters, duration on cards, country on cards |

---

## EPIC 1 — Tourism Experience Discovery  *(revenue: referral commission)*  · **P0 — DONE**

- **EXP-1** ✅ — Browse experience grid (mobile-first, image/name/category/price/location).
- **EXP-2** ✅ — Filter by category, location, price; results cached 5m; empty-state handled.
- **EXP-3** ✅ — Experience detail page `/experiences/[slug]`; referral/inquiry CTA (no booking engine).
- **EXP-4** ✅ — Keyword search via Postgres FTS + pg_trgm typo tolerance.
- **EXP-5** ⬜ P1 — As a *Provider*, I want a trackable referral link so LOC's commission is attributable. *AC:* outbound CTA tagged with referral param; click logged.
- **EXP-6** ✅ — Natural-language discovery via pgvector hybrid search (FTS + cosine, RRF fusion).

## EPIC 2 — Property Listings  *(revenue: lead fee / subscription / featured)*  · **P0 — DONE**

- **STAY-1** ✅ — Browse stays in filterable grid (type/price/location).
- **STAY-2** ✅ — Property detail page `/stays/[slug]`; inquiry form → contact pipeline.
- **STAY-3** ✅ — `listing_tier` drives ordering; featured/premium visually marked.
- **STAY-4** ⬜ P1 — As a *Landlord*, I want each inquiry routed to me. *AC:* `notify_partner()` emails the owner; lead stored.

## EPIC 3 — Digital Product Store  *(revenue: direct sale)*  · **P1 — DONE**

- **STORE-1** ✅ — Browse products grid `/store`.
- **STORE-2** ✅ — Product detail page `/products/[slug]`; buy CTA → external link (Gumroad/Lemon Squeezy).
- **STORE-3** ✅ — `POST /api/v1/products` — editor can create a product via API (with 409 on duplicate slug).

## EPIC 4 — Tourism Media / Content Hub  *(revenue: SEO trust, sponsored posts)*  · **P1 — DONE**

- **BLOG-1** ✅ — Browse articles grid `/blog`; tag filter.
- **BLOG-2** ✅ — Article page `/blog/[slug]`; SEO metadata.
- **BLOG-3** ✅ — "Related articles" via vector cosine similarity; falls back to tag overlap.

## EPIC 5 — Business Promotion Packages  *(revenue: sponsored / agency)*  · **P1 — DONE**

- **PROMO-1** ✅ — `/promote` page with three-tier packages (Visibility/Content/Growth).
- **PROMO-2** ✅ — Inquiry form on `/promote` → LOC sales pipeline.

## EPIC 6 — Inquiry & Lead Engine  *(cross-cutting backbone)*  · **P0 — DONE**

- **LEAD-1** ✅ — Shared `InquiryForm`; Next proxy route → FastAPI; validation + success/error states.
- **LEAD-2** ✅ — Inquiries persisted to `inquiries` table; `notify_partner()` stub wired.
- **LEAD-3** ⬜ P1 — Basic lead/referral tracking; `source_type` + `source_id` recorded; simple export endpoint.

## EPIC 7 — Platform & Foundations  *(enablers)*  · **P0 — DONE**

- **INFRA-1** ✅ — Docker stack (`docker compose up` → all 4 services running).
- **INFRA-2** ✅ — Layered FastAPI skeleton + Alembic (`make migrate` clean, `make test` passes).
- **INFRA-3** ✅ — Homepage hero + section structure; Navbar links resolve; mobile layout correct.
- **INFRA-4** ✅ — Data models match spec: `price_min/max`, `images(JSONB)`, `is_featured`, `listing_tier`, contact fields, `inquiries` table.
- **INFRA-5** ✅ — `output: standalone` conditional; Docker build produces `.next/standalone`; Vercel build works without it.
- **INFRA-6** ✅ — CI (GitHub Actions): `ruff`, `pytest`, `eslint`, `tsc --noEmit`, `next build` — all green.

## EPIC 8 — Global Expansion  *(brand reach)*  · **DONE**

- **GLOB-1** ✅ — `country` field added to `Experience` and `Property` (migration 004).
- **GLOB-2** ✅ — Global seed: 10 experiences across Japan, France, UK, Belgium, Bali, Greece, Italy, Morocco; 6 properties across 5 countries.
- **GLOB-3** ✅ — `frontend/lib/images.ts`: Unsplash pool by category/property type, slug-hash deterministic picker.
- **GLOB-4** ✅ — All Morocco-specific copy removed: layout metadata, hero, footer, all page titles, ArticleGrid empty state, Tailwind comment.
- **GLOB-5** ✅ — Typewriter hero: cycles Morocco → Paris → Greece → Belgium → London → Madrid → Barcelona → Bali → Kyoto → Amsterdam → Santorini → Prague → **the World**.
- **GLOB-6** ✅ — `PropertyType` expanded: `riad/ryokan/gite/hotel/bivouac`. `ExperienceCategory` expanded: `culture/culinary`.

---

## EPIC 9 — GetYourGuide-Inspired Discovery Layer  *(R4 — Active)*

Selectively borrows GYG's UX patterns for intent-first discovery. Does **not** copy booking engine, reviews, or urgency dark patterns.

- **DISC-1** 🔵 P0 — As a *Tourist*, I want a search bar in the homepage hero so I can start with intent rather than browsing.
  *AC:* Input below typewriter, routes to `/experiences?q=...` on submit; pre-fills if `?q` already set; matches existing `ExperienceFilters` search behaviour.

- **DISC-2** 🔵 P0 — As a *Tourist*, I want a "Popular Destinations" section on the homepage so I can browse by place.
  *AC:* 8 destination photo cards (Japan, France, Morocco, Bali, Greece, UK, Italy, Belgium) with cover image + country name; links to `/experiences?country=X`; horizontal scroll on mobile, 4-col grid on desktop.

- **DISC-3** 🔵 P1 — As a *Tourist*, I want to filter experiences and stays by country so I can browse one destination at a time.
  *AC:* `country` query param added to `ExperienceFilters` and `PropertyFilters`; backend search endpoint accepts `country` filter; existing category filter still works alongside it.

- **DISC-4** 🔵 P1 — As a *Tourist*, I want to see the duration of an experience on the card so I can quickly judge fit.
  *AC:* `duration` field added to frontend `Experience` type; rendered as a clock badge (e.g. "2 hours") on `ExperienceCard` below the location line; backend `ExperienceRead` schema exposes it.

- **DISC-5** 🔵 P1 — As a *Tourist*, I want to see the country on experience and property cards so the global scope is tangible.
  *AC:* Country name shown as a secondary line or flag chip on both `ExperienceCard` and `PropertyCard`; gracefully absent when `country` is null.

- **DISC-6** ⬜ P2 — As a *Tourist*, I want a destination page `/destinations/[country]` so I can read a curated intro and see all listings for that country.
  *AC:* Dynamic route; hero with destination cover photo; curated intro text; experiences + stays tabs filtered by country.

- **DISC-7** ⬜ P2 — As a *Dev*, I want the backend `/experiences` endpoint to accept a `country` query param so the frontend country filter has API support.
  *AC:* `country: str | None` param in `ExperienceService.search()`; repository adds `.filter(Experience.country == country)` when set; cached with country in the cache key.

---

## Suggested release slices

| Release | Stories | Outcome |
|---|---|---|
| **R4a — Hero + Destinations (this sprint)** | DISC-1, DISC-2, DISC-4, DISC-5 | Homepage feels GYG-inspired; duration + country visible on cards |
| **R4b — Country filtering** | DISC-3, DISC-7 | Filter by destination end-to-end (frontend + backend) |
| **R4c — Destination pages** | DISC-6 | Deep destination experience; SEO for "things to do in Japan" etc. |
| **R5 — Auth + Dashboard** | Partner self-serve, lead tracking, admin | Business tier: partners manage their own listings |

Ship R4a before R4b — the UI change is independent of the backend filter.
