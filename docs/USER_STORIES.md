# LOC — Product Backlog (User Stories)

Written as Product Owner. Grounded in the LOC brief and skill: a tourism **connector + media brand** that earns through referrals, leads, sponsored placements, and digital product sales — **not** bookings or checkout.

**Personas**
- **Tourist** — traveler discovering experiences/stays/content (mobile-first).
- **Provider** — experience/activity business wanting clients.
- **Landlord** — property owner wanting visibility and leads.
- **Advertiser** — tourism business buying sponsored placement/content.
- **Editor** — LOC team member publishing content and managing listings.

**Priority:** P0 = launch-critical · P1 = fast-follow · P2 = later phase.
**Story IDs** are referenced by branches/PRs (e.g. `feature/EXP-2`).

---

## EPIC 1 — Tourism Experience Discovery  *(revenue: referral commission)*  · **P0**

- **EXP-1 (P0)** — As a *Tourist*, I want to browse experiences in a card grid so I can see what's available.
  *AC:* mobile-first grid; each card shows image, name, category, price range, location; data via `useExperiences()`.
- **EXP-2 (P0)** — As a *Tourist*, I want to filter by category, location, and price so I can narrow to what fits.
  *AC:* filters combine in one request; results cached 5m; empty-state handled.
- **EXP-3 (P0)** — As a *Tourist*, I want an experience detail page so I can decide and make contact.
  *AC:* `/experiences/[slug]`; provider info, gallery, description; **referral/inquiry CTA** (no booking engine).
- **EXP-4 (P1)** — As a *Tourist*, I want to search experiences by keyword so I can find a specific activity fast.
  *AC:* Postgres FTS + `pg_trgm` typo tolerance (see `docs/SEARCH_STRATEGY.md`); results ranked.
- **EXP-5 (P1)** — As a *Provider*, I want my listing to carry a trackable referral link so LOC's commission is attributable.
  *AC:* outbound CTA tagged with referral param; click logged.
- **EXP-6 (P2)** — As a *Tourist*, I want natural-language discovery ("desert escape under $300") so I get relevant results without filters.
  *AC:* Phase-2 hybrid search (FTS + pgvector).

## EPIC 2 — Property Listings  *(revenue: lead fee / subscription / featured)*  · **P0**

- **STAY-1 (P0)** — As a *Tourist*, I want to browse stays (apartments, villas, vacation homes) in a filterable grid.
  *AC:* filters location/type/price; `PropertyCard` grid; mobile-first.
- **STAY-2 (P0)** — As a *Tourist*, I want a property detail page with an inquiry form so I can contact about a stay.
  *AC:* `/stays/[slug]`; inquiry posts to `POST /api/v1/contact`; **no direct booking**.
- **STAY-3 (P1)** — As a *Landlord*, I want a "featured/premium" placement tier so my property surfaces higher.
  *AC:* `listing_tier` drives ordering; featured visually marked.
- **STAY-4 (P1)** — As a *Landlord*, I want each inquiry routed to me so I get the lead LOC generated.
  *AC:* `notify_partner()` emails/webhooks the owner; lead stored.

## EPIC 3 — Digital Product Store  *(revenue: direct sale)*  · **P1**

- **STORE-1 (P1)** — As a *Tourist*, I want to browse travel guides/maps/packs so I can buy useful digital products.
  *AC:* `/store` grid; product cards with cover, title, price.
- **STORE-2 (P1)** — As a *Tourist*, I want a product page with a buy button so I can purchase.
  *AC:* `/products/[slug]`; CTA links to **Gumroad/Lemon Squeezy** (no in-house checkout).
- **STORE-3 (P2)** — As an *Editor*, I want to add a product by pointing at its external sale URL so I can list without code.
  *AC:* product create includes `external_url`, `kind`.

## EPIC 4 — Tourism Media / Content Hub  *(revenue: SEO trust, sponsored posts)*  · **P1**

- **BLOG-1 (P1)** — As a *Tourist*, I want to read travel articles / watch reels so I trust LOC and discover places.
  *AC:* `/blog` grid; article + embedded Reels/TikTok where possible.
- **BLOG-2 (P1)** — As a *Tourist*, I want an article page so I can read a full guide.
  *AC:* `/blog/[slug]`; tags; SEO metadata.
- **BLOG-3 (P2)** — As a *Tourist*, I want "related articles" so I keep exploring.
  *AC:* Phase-2 vector similarity on content.

## EPIC 5 — Business Promotion Packages  *(revenue: sponsored / agency services)*  · **P1**

- **PROMO-1 (P1)** — As an *Advertiser*, I want a page describing promotion/content packages so I understand offerings.
  *AC:* `/promote`; packages (social promo, reels, featured placement, content production).
- **PROMO-2 (P1)** — As an *Advertiser*, I want an inquiry form so I can request a package.
  *AC:* posts to contact pipeline; routed to LOC sales.

## EPIC 6 — Inquiry & Lead Engine  *(cross-cutting, monetization backbone)*  · **P0**

- **LEAD-1 (P0)** — As a *Tourist*, I want one reliable inquiry form so contacting any provider/landlord works the same way.
  *AC:* shared `InquiryForm`; Next route proxies to FastAPI; validation + success/error states.
- **LEAD-2 (P0)** — As an *Editor*, I want inquiries stored and the right partner notified so no lead is lost.
  *AC:* persisted to `inquiries` table; `notify_partner()`; cache invalidated on write.
- **LEAD-3 (P1)** — As an *Editor*, I want basic lead/referral tracking so we can prove LOC's value to partners.
  *AC:* `source_type` + `source_id` recorded; simple export endpoint.

## EPIC 7 — Platform & Foundations  *(enablers)*  · **P0**

- **INFRA-1 (P0)** — As an *Editor/Dev*, I want the Dockerized stack so anyone can run LOC locally with one command.
  *AC:* `docker compose up` from repo root starts all 4 services; frontend on :3000, API docs on :8000/docs; no manual Python/Node install needed.
  *Status:* **open** — compose + Dockerfiles now in repo root; verify end-to-end before closing.
- **INFRA-2 (P0)** — As a *Dev*, I want the layered FastAPI skeleton + Alembic wired so features drop into a consistent structure.
  *AC:* `make migrate` runs cleanly; `make test` passes; all 5 endpoints return 200/404 correctly.
- **INFRA-3 (P0)** — As a *Tourist*, I want a homepage with hero + clear paths (experiences / stays / store / content) so I know what LOC offers.
  *AC:* `/` renders hero + section stubs; mobile layout passes; Navbar links all resolve.
- **INFRA-4 (P0)** — As a *Dev*, I want the data models corrected to match the architecture spec so filtering and sorting work.
  *AC:* `price_range: str` replaced with `price_min/price_max: float`; `image_url: str` replaced with `images: JSONB`; `is_featured` added to experiences; `listing_tier` added to properties; `owner_contact`/`provider_contact` added; `inquiries` table created; Alembic migration included.
- **INFRA-5 (P0)** — As a *Dev*, I want `next.config.ts` to have `output: 'standalone'` so the production Docker image builds correctly.
  *AC:* `npm run build` produces `.next/standalone`; `docker compose -f ... -f docker-compose.prod.yml build` succeeds.
- **INFRA-6 (P1)** — As a *Dev*, I want CI (lint/test/build) on PRs so `develope` stays green.
  *AC:* GitHub Actions runs `ruff`, `pytest`, `eslint`, `tsc --noEmit`, `next build` in parallel on every PR.

---

## Suggested release slices

| Release | Stories | Outcome |
|---|---|---|
| **R0 — Foundation** | INFRA-1/2/4/5 | Stack runs locally; models match spec; prod image builds |
| **R1 — Core platform live** | INFRA-3, EXP-1/2/3, STAY-1/2, LEAD-1/2 | Tourists discover experiences & stays and send inquiries → first referral/lead revenue |
| **R2 — Monetize the audience** | STORE-1/2, BLOG-1/2, PROMO-1/2, EXP-4/5, STAY-3/4, LEAD-3 | Digital sales, content/SEO, sponsored packages, attributable referrals |
| **R3 — Discovery & scale** | EXP-6, BLOG-3, STORE-3, INFRA-6, auth/dashboard | Hybrid search, recommendations, partner self-serve, CI gate |

Ship R1 end-to-end before starting R2 — lean first, sophistication layered.
