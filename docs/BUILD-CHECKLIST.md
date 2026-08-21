# LOC — Build Checklist

Single source of truth for where this build actually stands. Lives at
`docs/BUILD-CHECKLIST.md`. Update as work lands — don't let it go stale.
Cross-reference with `docs/USER_STORIES.md` (story IDs) and `docs/WORKFLOW.md`.

**Stack:** Next.js 15.3 · FastAPI · PostgreSQL 16 + pgvector · Redis · Docker
**Branches:** `develope` = documented as active development, but **as of 2026-08-14 is
stale and 40 commits behind `main`** — `origin/develope` has zero commits `main`
doesn't already contain, and a large amount of undocumented work (the WCAG contrast
rebuild, dead dark-theme removal, reduced-motion pass, the CF Access fix, this
session's a11y fixes) landed directly on `main`. Treat `main` as the real working
branch until `develope` is either deleted or re-synced; don't assume `develope` is
current without checking `git log origin/main..origin/develope` first.
**Deployment:** Hostinger VPS via Coolify · DNS on Cloudflare · `docker-compose.coolify.yml`
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

- [x] Brand palette defined — **rebuilt 2026-08-05 from the logo.** `Loc.png` samples to
      `#C9885C`, byte-identical to the Impactors Academy mark, so Loc is in the parent
      family. `loc-copper #C9885C` is the logo value (mark + dark grounds, 7.03:1 on
      black); `loc-terracotta` retuned `#C4714A` → `#A16036` — same hue as the logo (24°,
      was 18°) at a lightness that clears AA (4.95:1 white, 4.75:1 `--background`).
      The old value failed AA at 3.62:1 everywhere it was used as text, as did
      `--primary` at 3.67:1. Remaining: sand `#F7EDD8`, amber `#D4A44C`, teal `#2D6A6A`,
      night `#1A1A2E`. Derivation: `/color-combinations` skill.
- [x] **Contrast pass on the two tokens the palette rebuild did not reach (2026-08-05).**
      `loc-stone` `#8B7355` → `#7F694D`: it measured 4.31:1 on the page background
      (`--background` 37 50% 98%, `#FCFAF7`) and 4.49:1 on white — under AA both ways,
      while carrying card descriptions and every meta row across ~40 files. Same hue
      (33°) and saturation, lowered in lightness only: now 5.02:1 / 5.23:1, so the one
      token change fixed every usage. `loc-amber` is now documented decorative-only —
      white on it is 2.28:1, so the three badges using it (experience "Featured",
      property tier, promote "Most popular") moved to `loc-night` at 7.48:1, matching
      the palette's own dark-ink-on-copper logic. The admin featured chip was worse at
      1.96:1; terracotta would not have cleared it either (4.26:1), so that is
      `loc-night` too.
- [x] **Dead dark theme deleted (2026-08-07).** `.dark` in `frontend/app/globals.css`
      defined 25 lines of tokens nothing could ever apply: no theme toggle,
      `next-themes` not in `package.json` at all, no `ThemeProvider`, nothing adding
      the class, and zero `dark:` utilities in any `.tsx` under `app/`, `components/`
      or `lib/` — `app/manifest.ts` already said "LOC is a light site." It had also
      drifted off-brand: a `230°` blue-grey ground, the exact cool neutral the light
      palette was deliberately warmed away from. Wiring it up would have meant
      shipping a second palette nobody designed or reviewed, so it was deleted.
      `darkMode: ["class"]` stays in `tailwind.config.ts` with a comment saying it is
      the strategy a future dark theme would use, not a live feature.
- [x] **`prefers-reduced-motion` respected (2026-08-05)** — previously honoured nowhere,
      while the hero autoplayed a looping video and five grids animated. Three layers,
      because no single one reaches everything: a media block in `globals.css` for
      keyframes/transitions; `MotionConfig reducedMotion="user"` in `app/providers.tsx`
      for framer-motion (it drives inline styles from JS and never sees CSS); and a
      shared `usePrefersReducedMotion` hook for what neither reaches — the hero's
      `autoPlay` attribute (now falling back to its poster via `HeroVideo`) and the
      typewriter (settles on "the World", no caret). The hook listens for changes, so
      toggling the OS setting applies without a reload.
- [x] Logo shipped — mark cropped square from `Loc.png`, wired into the navbar lockup
      (`public/icons/loc-mark.png`), favicon (`app/icon.png`) and touch icon.
      `public/icons/` previously held only a `.gitkeep`.
- [x] Dead demo images fixed — `photo-1568393691622` returned 404 in 4 places incl. the
      Kyoto tea ceremony card; audit found a second (`photo-1613490493576`) with a stale
      hash. Every Unsplash URL in `_data.ts`, `images.ts` and `seed.py` now returns 200.
- [x] Design tokens — **not converted to CSS custom properties by design (2026-08-14
      review).** `loc-*` in `tailwind.config.ts` are raw hex, but every value already
      carries an inline WCAG-derivation comment (contrast ratio, what it replaced, why)
      and is the single source of truth — confirmed via grep that zero components use
      an inline hex literal or an arbitrary `bg-[#...]` value anywhere in `app/` or
      `components/`; all 54 files reference the `loc-*` / semantic (`--primary` etc.)
      utilities. Converting the hex to `var(--loc-*)` would be a cosmetic wrapper with
      no behavioural difference (no theme switching consumes it) and would separate
      the derivation comments from the values they justify, so left as-is.
- [x] Restraint/hierarchy — spot-checked homepage, `/experiences`, an experience
      detail page, `/stays`, and `/destinations/[country]` in a real browser
      2026-08-14; hierarchy, spacing, and the copper/cream palette read clean with
      no obvious issues. Not a full page-by-page `/ui-ux-pro-max` pass — re-open if a
      specific page needs one.
- [x] Accessibility — **2026-08-14, scoped to the customer-facing "product" pages**
      (home, experiences, stays, store, destinations; admin CMS not touched).
      Image alt text on listing cards was already solid (title + location). Fixed:
      filter pill groups (`ExperienceFilters`, `PropertyFilters`) had no `aria-pressed`
      or group label — a screen reader user had no way to tell which filter was
      active; added `role="group"` + `aria-label` + `aria-pressed` on every pill.
      `DestinationTabs` was a plain button pair with no tab semantics — rebuilt as a
      real ARIA tabs pattern (`role="tablist"/"tab"/"tabpanel"`, `aria-selected`,
      `aria-controls`). `InquiryForm` (used on every experience/stay/product detail
      page) had visual `<label>` text with no `htmlFor`/`id` — screen readers were
      falling back to the placeholder as the accessible name, which disappears once
      typing starts; added the id/htmlFor pairs, plus `role="status"` on the success
      message and `role="alert"` on the error message. All verified live in a real
      browser (accessible names, `aria-pressed`/`aria-selected` toggling correctly).
      Focus states already present site-wide (`focus:ring-2` on every interactive
      element). No modals exist on the product side to audit.
- [x] Global copy: all hero/section copy globalised (not Morocco-only language)
- [x] Typewriter hero wired with 10-destination rotation

## Phase 3 — Architecture & Data

- [x] Repo structure: `frontend/` (Next.js) + `backend/` (FastAPI) + `docker-compose.yml`
- [x] Docker stack: `docker compose up` → all 4 services running locally.
      **Two blockers found and fixed 2026-08-05 — the documented path could not
      have worked for a fresh clone.** (1) `backend/Dockerfile` pulled `uv` via
      `COPY --from=ghcr.io/astral-sh/uv:latest`, so the build needs a second
      registry and dies outright wherever ghcr.io is unreachable (stale creds,
      registry policy, air-gapped runner) — now `pip install uv==0.12.1` from
      PyPI, which the build already depends on. (2) `CORS_ORIGINS` crashed the API
      on boot: pydantic-settings JSON-decodes complex types *before* validators
      run, so the comma-separated value in `docker-compose.yml` and `.env.example`
      raised `SettingsError` and `parse_cors_origins` was dead code. Fixed with
      `Annotated[list[str], NoDecode]`; plain, comma-separated, JSON-array and
      unset forms all parse. `EDITOR_API_KEY` also added to `.env.example` — it is
      required and fails closed, but was undocumented.
- [x] FastAPI skeleton — versioned `/api/v1/`, CORS to Next.js origin, Pydantic v2
- [x] PostgreSQL 16 + pgvector + Redis configured and running in Docker
- [x] Alembic migrations — `make migrate` runs clean; migration history intact.
      **Corrected 2026-08-05: this was not true on an empty database.** `001infra4`
      was the base revision (`down_revision = None`) but only ALTERs `experiences`
      and `properties` — nothing in the chain ever created them, or `blog_posts`
      and `products`. Those came from `Base.metadata.create_all()`
      (`app/db/init_db.py`) and Alembic was adopted afterwards without a baseline,
      so `alembic upgrade head` on a fresh clone died on the first migration with
      `UndefinedTable: relation "experiences" does not exist`. Added
      `000_baseline_schema.py` reconstructing the pre-001 shape (current models
      minus everything 001-006 add, with the three columns 001 drops restored).
      Verified: all seven revisions replay on an empty DB, the resulting schema
      diffs clean against the SQLAlchemy models for all six tables (`search_vector`
      is db-only by design — the generated tsvector from 002), and `scripts.seed`
      runs on top. Existing deployments are unaffected: they are stamped at a later
      revision and Alembic only walks forward.
- [x] Data models: `Experience`, `Property`, `Product`, `Article`, `Inquiry`,
      `listing_tier`, `country`, `images` (JSONB), `is_featured`
- [x] CI: ruff, pytest, eslint, tsc --noEmit, next build — all green
- [ ] Production environment vars documented — all `DATABASE_URL`, `REDIS_URL`,
      `NEXTAUTH_SECRET` etc. confirmed set in the Coolify UI (see `docs/DEPLOYMENT.md`)

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
- [x] **Mother/daughter network — no code changes needed (2026-08-10)** — the
      impactors-academy mother dashboard's new "Publish to" option on its blog
      editor (tick which platforms a post goes to) reads loc's blog via
      the existing public `GET /api/v1/blog/` and writes drafts via the existing
      `POST /api/v1/blog/` (already gated by `require_editor_key`) — both
      endpoints already covered this, nothing here needed to change. loc's
      `content` field is plain text, not the Tiptap JSON ia-pro/impactors-academy
      use — the mother dashboard sends plain text here and adapts to Tiptap doc
      shape for the other two. Verified end-to-end against a local instance of
      this backend (created via the mother's actual sync code path, then
      re-saved → updated in place rather than duplicated, then cleaned up).
      Mother holds drafts back from loc, since loc has no draft state and
      anything sent here is immediately live. `EDITOR_API_KEY` matches the mother
      dashboard's `LOC_EDITOR_API_KEY` — confirmed in production 2026-08-13:
      published a real post from the mother dashboard with all three targets
      ticked, verified it landed at `loctravels.com/blog/<slug>` (200), then
      deleted the test row via `DELETE /api/v1/blog/<slug>`. See
      impactors-academy `BUILD-CHECKLIST.md` and workspace `MASTER-CHECKLIST.md`
      Phase 3 for the full feature.

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
- [x] Rate limiting on inquiry form — slowapi `@limiter.limit("5/minute")` on
      `POST /api/v1/contact/`. Was already implemented and unmarked; **verified
      live 2026-08-08**: requests 1–5 return 200, 6 and 7 return 429.
- [x] CORS locked to production origin — no wildcard anywhere; `cors_origins`
      defaults to `http://localhost:3000` for dev and is set to
      `["https://loctravels.com"]` in Coolify (see `docs/DEPLOYMENT.md`).
- [ ] No secrets committed — `DATABASE_URL`, `REDIS_URL`, API keys in `.env` only;
      `git log --all -- .env` returns empty
- [x] **HTTP security headers** — `app/core/security_headers.py`, applied to
      every API response including errors. HSTS only when the request arrived
      over https (`x-forwarded-proto`), because sending it over plain http is
      ignored by browsers and would pin localhost to https for two years in dev.
      4 tests; verified live 2026-08-08.
- [x] **Cloudflare Access on editor/admin routes** — verified live 2026-08-08:
      `/admin` and `/api/admin/*` both 302 to the Access login on
      `delicate-king-3ab8.cloudflareaccess.com`; marketing routes stay public.
- [x] **Access JWT verified at the origin** — `frontend/middleware.ts` (2026-08-08).
      The edge policy only covers traffic that arrives through Cloudflare; a request
      hitting the container directly bypassed it entirely, and `/api/admin/[...path]`
      attaches `EDITOR_API_KEY` to everything it forwards, so that was an unauthenticated
      write path and a read of every lead. Fail-closed: unset Access config in production
      returns 503.
- [x] **`/admin` 500 root-caused and fixed — 2026-08-13.** `CF_ACCESS_TEAM_DOMAIN`
      and `CF_ACCESS_AUD` in Coolify were literally set to the placeholder
      instructional text from `.env.example` (`"set CF_ACCESS_TEAM_DOMAIN — e.g.
      your-team.cloudflareaccess.com"`), not real values — that string reached
      `new URL()` in the middleware and threw `ERR_INVALID_URL` uncaught, so the
      intended fail-closed 503 became an unhandled 500 instead. Set the real team
      domain (`delicate-king-3ab8.cloudflareaccess.com`) and the AUD tag from the
      "LOC Admin" Access application, and redeployed.
      **Second, bigger problem found while fixing the first:** all three DNS
      records (`loctravels.com`, `www`, `api`) were "DNS only" — not proxied
      through Cloudflare at all. Access policy at the edge was never seeing any
      traffic for this zone; only the origin's own JWT check (above) was ever
      providing protection, and since Access never ran, no valid token could ever
      be issued — `/admin` would have stayed permanently inaccessible once the 500
      was fixed. `SSL/TLS` mode was already "Full (strict)" (changed 8 days prior,
      likely the fix for whatever broke proxying the last time it was tried) and
      the origin already had a valid Let's Encrypt cert, so switched all three
      records to Proxied. Verified live: homepage and `api.loctravels.com/health`
      both 200, `/admin` now correctly 302s to
      `delicate-king-3ab8.cloudflareaccess.com/cdn-cgi/access/login/...` with a
      real `cf-ray` header confirming edge enforcement is actually active.
- [x] **CSP header** — plus the same header set, on the Next.js frontend via
      `next.config.ts` `headers()`. `connect-src` is derived from
      `NEXT_PUBLIC_API_URL` rather than hard-coded, so it follows the
      environment instead of blocking every API call locally.
      **Caveat:** `script-src`/`style-src` keep `'unsafe-inline'` — the app
      styles with React `style={{}}` props, next/font injects an inline style
      block, and the JSON-LD blocks are inline scripts. Nonces would require
      rendering every page dynamically. **Not yet verified in a real browser**
      (the Chrome extension was unavailable) — load the site once with devtools
      open and check for CSP violations before trusting it.
- [x] **CSP fixed where it was silently breaking** (2026-08-08). Three faults the
      policy only showed once something actually rendered:
      `/docs` and `/redoc` are the only HTML this API serves, and Swagger UI loads
      its CSS and JS from jsdelivr, so `default-src 'none'` returned 200 and a
      blank page — those two paths now get a policy allowing exactly what the UI
      loads, everything else keeps the strict one (2 new tests pin both).
      The frontend CSP and HSTS no longer apply to `next dev` — dev needs a
      localhost websocket and eval for hot reload, so enforcing the production
      policy locally broke the page under test while proving nothing about
      production.
      `scripts/dev-local.sh prod` builds to `.next-prod` (via `NEXT_DIST_DIR`)
      and serves on :3001 beside the dev server — the only honest way to load
      the real headers locally. **Still unloaded in a browser.**

## Phase 7 — Deployment & DevOps

**Plan changed (2026-08-02): deploying via Coolify on the org's Hostinger VPS —
not Vercel/Railway — on the `loctravels.com` domain (already on Cloudflare),
same pattern as impactors-academy. `railway.toml` and the old SSH-based
`.github/workflows/deploy.yml` + `nginx/loc.conf` are superseded by this and
have all since been deleted (2026-08-08).**

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
- [x] Old deploy path retired: `railway.toml` and `.github/workflows/deploy.yml` are
      gone; the Vercel project and its GitHub integration were deleted 2026-08-08;
      `nginx/loc.conf` deleted 2026-08-08. Coolify is the only deploy path.

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
- [x] **`GET /api/v1/admin/metrics` (2026-08-21)** — feeds the mother
      dashboard's Phase 6B business-metrics card (`[workspace]/MASTER-CHECKLIST.md`).
      New `app/api/v1/endpoints/admin_metrics.py`, gated behind
      `require_editor_key` same as `/leads` — no new secret. Returns inquiry
      total/7d, experience/property counts, top 5 destinations by experience
      count, and blog post total/last-published-at. 3 pytest tests added
      (fail-closed 503, wrong-key 403, valid-key 200 shape) — full suite (13
      tests) green against a real local Postgres. Verified live against real
      seeded dev data (6 inquiries, 10 experiences, 6 properties, Japan/
      France/Italy top destinations) — curled directly and confirmed
      end-to-end in the mother dashboard's browser render. On
      `feature/admin-metrics-api`, PR #21 open against `main` — not yet
      merged. `LOC_API_URL`/`LOC_EDITOR_API_KEY` already exist on
      impactors-academy's Coolify env (checked directly, corrected the
      earlier "not configured" note in the workspace `MASTER-CHECKLIST.md`);
      whether the key value actually matches this app's `EDITOR_API_KEY`
      can't be verified without logging into production `/admin` — that's
      the real test once this merges.

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
2. ~~**Production deploy not confirmed**~~ — CLOSED 2026-08-08. `loctravels.com`
   served 200 on 2026-08-07 from Coolify on the org's Hostinger VPS. The leftover
   Vercel project and its GitHub integration — which had been building every PR and
   reporting "Deployment has completed" on PR #14 — were deleted 2026-08-08, along
   with the Vercel app config in this repo. Coolify is now the only deploy path.
   Remaining verification: confirm the `GET /health` check and `api.loctravels.com`
   independently of the frontend.
3. ~~**R4 hero search**~~ — verified complete on `develope` (2026-08-02).
4. **Custom domain** — confirm final domain for LOC (`loctravels.com` per Phase 7 plan
   vs. subdomain under `impactorsacademy.com`).
5. ~~**CSV export (LEAD-3)**~~ — CLOSED 2026-08-03: `GET /api/v1/leads/export.csv`
   returns `text/csv` StreamingResponse.
6. ~~**Editor CRUD gap**~~ — CLOSED: POST/PUT/DELETE exist for experiences, properties,
   products, and blog posts — all behind `require_editor_key`.
7. **Working branch note** — `docs/BUILD-CHECKLIST.md` should be committed to git so it
   tracks with the code; currently untracked.
