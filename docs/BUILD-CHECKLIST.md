# LOC — Build Checklist

Single source of truth for where this build actually stands. Lives at
`docs/BUILD-CHECKLIST.md`. Update as work lands — don't let it go stale.
Cross-reference with `docs/USER_STORIES.md` (story IDs) and `docs/WORKFLOW.md`.

**Stack:** Next.js 15.3 · FastAPI · PostgreSQL 16 + pgvector · Redis · Docker
**Branches:** `develope` = active development · `main` = production-stable
**Deployment:** Vercel (frontend) · Railway (backend + PostgreSQL + Redis)
**Revenue model:** referrals, leads, featured placement, digital product sales — not bookings

---

## Phase 1 — Discovery & Planning

- [x] Platform scope defined — global tourism connector + media brand; LOC earns
      via referrals/leads/featured/digital products, never via booking engine
- [x] Persona definitions — Tourist, Provider, Landlord, Advertiser, Editor
- [x] Revenue streams mapped — referral commission, lead fee/subscription,
      featured placement, digital product sales, sponsored content
- [x] Tech stack decided and documented in `SKILL.md`

## Phase 2 — Design & Content

- [x] Brand palette defined — terracotta `#C4714A`, sand `#F7EDD8`, amber `#D4A44C`,
      teal `#2D6A6A`, night `#1A1A2E`, stone `#8B7355`
- [ ] Design tokens established as CSS custom properties — no hardcoded hex values
      in components; palette, type scale, spacing, and easing all tokenised
- [ ] Restraint/hierarchy pass on all key pages — `/ui-ux-pro-max`
- [ ] Accessibility pass — focus states, ARIA on filters/modals, image alt text
      on all listing cards
- [x] Global copy: all hero/section copy globalised (not Morocco-only language)
- [x] Typewriter hero wired with 10-destination rotation

## Phase 3 — Architecture & Data

- [x] Repo structure: `frontend/` (Next.js) + `backend/` (FastAPI) + `docker-compose.yml`
- [x] Docker stack: `docker compose up` → all 4 services running locally
- [x] FastAPI skeleton — versioned `/api/v1/`, CORS to Next.js origin, Pydantic v2
- [x] PostgreSQL 16 + pgvector + Redis configured and running in Docker
- [x] Alembic migrations — `make migrate` runs clean; migration history intact
- [x] Data models: `Experience`, `Property`, `Product`, `Article`, `Inquiry`,
      `listing_tier`, `country`, `images` (JSONB), `is_featured`
- [x] CI: ruff, pytest, eslint, tsc --noEmit, next build — all green
- [ ] Production environment vars documented — all `DATABASE_URL`, `REDIS_URL`,
      `NEXTAUTH_SECRET` etc. confirmed set in Vercel + Railway dashboards

## Phase 4 — Build

### Completed Releases
- [x] **R0 — Foundation** — Docker stack, Alembic, models, CI skeleton
- [x] **R1 — Core platform** — experiences/stays/store/blog pages, inquiry form,
      referral CTAs, `/experiences/[slug]`, `/stays/[slug]`, `/products/[slug]`
- [x] **R2 — Monetisation** — digital store `/store`, blog `/blog`, promote page
      `/promote` (3-tier packages), Postgres FTS search, featured tiers
- [x] **R3 — Discovery & scale** — pgvector hybrid search (FTS + cosine, RRF fusion),
      related articles via vector cosine, `POST /api/v1/products`, global seed (10 destinations)
- [x] **Global pivot** — `country` field on Experience + Property (migration 004),
      Unsplash image pool, all copy globalised

### R4 — GYG-inspired Discovery (verified complete on `develope` 2026-08-02)
- [x] Hero search bar — `HeroSearchBar` wired into `HeroSection` (`showSearch` prop), used on homepage
- [x] Popular destinations section on homepage — `DESTINATIONS` grid + `/destinations/[country]` pages
- [x] Country filter on experience grid `/experiences` (`ExperienceFilters`) and stay grid `/stays` (`PropertyFilters`)
- [x] Duration shown on experience cards (`ExperienceCard` — `Clock` icon + `experience.duration`)
- [x] Country shown on experience and stay cards (`Globe` icon + `.country` on both cards)

### Pending Stories
- [x] **EXP-5** — Trackable referral links: `POST /api/v1/referrals/click/{slug}` logs click via
      `referral_click_repo`; `GET /api/v1/referrals/clicks/{slug}` returns count for commission attribution
- [x] **STAY-4** — Inquiry routing: `ContactService._notify_partner()` emails the property/experience
      owner (falls back to LOC team inbox); lead stored with `source_type + source_id`
- [x] **LEAD-3** — `source_type + source_id` on all inquiries ✅; `GET /api/v1/leads/export.csv`
      now returns a `StreamingResponse` with `text/csv` content-type, timestamped filename,
      and all inquiry fields; optional `?source_type=` / `?source_id=` filters honoured.
      Endpoint is behind `require_editor_key` (X-API-Key header). 2026-08-03.

### Editor Tooling
- [x] `POST /api/v1/products` — editor can create a product via API (409 on duplicate slug)
- [ ] Editor endpoints for Experience and Property create/update (so content doesn't
      require a DB migration to add new listings)
- [ ] Basic CMS or admin UI for the LOC editor persona

## Phase 5 — Testing & QA

- [x] CI skeleton — ruff, pytest, eslint, tsc, next build all green on every push
- [ ] Integration tests for inquiry flow end-to-end (form → FastAPI → DB → notify stub)
- [ ] Load test on hybrid search endpoint — pgvector + RRF under concurrent requests
- [ ] Cross-browser/mobile check — mobile-first layout verified on real device or BrowserStack
- [ ] Empty-state handling verified on all filter combinations (no results shown correctly)

## Phase 6 — Security

- [x] Editor API endpoints authenticated — `require_editor_key` dep (X-API-Key header,
      reads `EDITOR_API_KEY` env var, fail-closed if unset) applied to all write routes:
      POST/PUT/DELETE on experiences, stays, products, blog posts; all of /leads/.
      Verified in code 2026-08-03.
- [ ] Rate limiting on inquiry form — prevent spam submissions
- [ ] CORS locked to production origin only (not `*` or `localhost` in production config)
- [ ] No secrets committed — `DATABASE_URL`, `REDIS_URL`, API keys in `.env` only;
      `git log --all -- .env` returns empty
- [ ] `NEXTAUTH_SECRET` rotation plan documented

## Phase 7 — Deployment & DevOps

**Plan changed (2026-08-02): deploying via Coolify on the org's Hostinger VPS —
not Vercel/Railway — on the `loctravels.com` domain (already on Cloudflare),
same pattern as impactors-academy. `railway.toml` and the old SSH-based
`.github/workflows/deploy.yml` + `nginx/loc.conf` are superseded by this and
should be retired once the Coolify deploy is confirmed live (see Open Flags).**

- [x] `docker-compose.coolify.yml` drafted at repo root — single-file, Coolify
      "Docker Compose" resource, prod builds for frontend/backend, no pgadmin,
      no published ports on db/redis
- [ ] VPS capacity check run (`free -h`, `df -h`, `docker stats --no-stream`) —
      confirm headroom before adding 4 more containers (`/senior-devops`)
- [ ] Cloudflare DNS: `loctravels.com`, `www.loctravels.com`, `api.loctravels.com`
      → A records pointing at the VPS IP
- [ ] Coolify: new "Docker Compose" resource added, pointed at this repo/branch `main`,
      compose file path set to `docker-compose.coolify.yml`
- [ ] Coolify: domains assigned per service — frontend → `loctravels.com` +
      `www.loctravels.com` (port 3000), backend → `api.loctravels.com` (port 8000)
- [ ] Coolify: environment variables set (`POSTGRES_PASSWORD`, `EMAIL_TO`,
      `SMTP_*`, `OPENAI_API_KEY` optional) — no secrets committed to the compose file
- [ ] First deploy triggered — `alembic upgrade head` runs clean, all 4 containers healthy
- [ ] Production Docker build confirmed (`output: standalone` wired correctly)
- [ ] Health check endpoint (`/health`) returning 200 in production
- [ ] Old deploy path retired: `.github/workflows/deploy.yml`, `nginx/loc.conf`,
      `railway.toml` removed or clearly marked deprecated once Coolify deploy is verified

## Phase 8 — Launch

- [ ] SEO pass — OG/Twitter meta on experience/stay/product detail pages;
      JSON-LD (`TouristAttraction`, `LodgingBusiness`, `Product` schemas)
- [ ] `robots.txt` present; disallows editor/admin routes; points to sitemap
- [ ] `sitemap.xml` — covers `/experiences/[slug]`, `/stays/[slug]`, `/products/[slug]`,
      `/blog/[slug]` with `lastmod` from DB
- [ ] Analytics before launch — GA4 or Plausible; track referral CTA clicks,
      inquiry form submissions, product page views, search queries
- [ ] Social share preview verified (OG image renders correctly on WhatsApp/LinkedIn)

## Phase 9 — Post-launch

- [ ] Provider self-listing flow — form for experience providers to submit their business
- [ ] Landlord self-listing flow — form for property owners to request a listing
- [ ] Referral click tracking live in production and reviewed weekly
- [ ] Advertiser onboarding: `/promote` inquiries flowing into a tracked pipeline
- [ ] R5 scoped — user accounts, saved experiences, booking history (if LOC moves
      toward a logged-in experience)

---

## Standing rules

- LOC earns via referrals and leads — never implement a checkout or payment flow
  inside the platform; always link out to the provider's own booking system
- `develope` branch is always the working branch; `main` = production-stable —
  never push directly to `main`
- Every new listing type or filter must have a matching seed entry before the
  feature is considered testable
- pgvector hybrid search (RRF) is the canonical search path — do not regress to
  FTS-only; the two paths must coexist until vector is proven stable in production

---

## Open Flags

1. ~~**Editor auth**~~ — CLOSED 2026-08-03: all write endpoints use `require_editor_key`.
2. **Production deploy not confirmed** — Coolify deploy (not Vercel/Railway) is the
   target; DNS and health checks not yet verified. See Phase 7.
3. ~~**R4 hero search**~~ — verified complete on `develope` (2026-08-02).
4. **Custom domain** — confirm final domain for LOC (`loctravels.com` per Phase 7 plan
   vs. subdomain under `impactorsacademy.com`).
5. ~~**CSV export (LEAD-3)**~~ — CLOSED 2026-08-03: `GET /api/v1/leads/export.csv`
   returns `text/csv` StreamingResponse.
6. ~~**Editor CRUD gap**~~ — CLOSED: POST/PUT/DELETE exist for experiences, properties,
   products, and blog posts — all behind `require_editor_key`.
7. **Working branch note** — `docs/BUILD-CHECKLIST.md` should be committed to git so it
   tracks with the code; currently untracked.
