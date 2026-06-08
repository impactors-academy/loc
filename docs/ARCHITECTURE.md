# LOC — End-to-End Architecture

How a request flows across frontend, backend, and database, and where each rule from the project skill applies. This is the operating contract, not a restatement of the file tree.

## The stack at a glance

```
 Browser (mobile-first)
   │  HTTPS
   ▼
 Next.js App Router  ── TanStack Query (staleTime 5m) ── lib/api.ts (single fetch wrapper)
   │  /api/v1/...
   ▼
 FastAPI
   endpoints/  →  services/  →  repositories/  →  models/        (strict one-way flow)
                     │
                     ├── fastapi-cache2 @cache()  ◄── Redis  (TTL 5m, invalidate on write)
                     ▼
                 PostgreSQL 16 (+ pg_trgm now, pgvector later)
```

## Request lifecycle (read path — e.g. browsing experiences)

1. **Component** renders and calls a **hook** (`useExperiences()`), never `lib/api.ts` directly.
2. **TanStack Query** checks its client cache (`staleTime: 5m`). Fresh → no network. Stale → background refetch.
3. The hook calls **`lib/api.ts`**, the only place a `fetch()` lives, hitting `GET /api/v1/experiences?...`.
4. **Endpoint** parses/validates query params (Pydantic), calls a **service**. No DB access, no logic here.
5. **Service** checks **Redis** via `@cache()` (key `experiences:list`). Hit → return immediately. Miss → call **repository**, apply business rules (featured ordering, referral CTA shaping), cache, return.
6. **Repository** runs the SQLAlchemy query (filters, FTS) — the only layer touching the DB.
7. Response is serialized through a **Pydantic `*Read` schema** — ORM models are never returned raw.

## Request lifecycle (write path — e.g. inquiry / lead capture)

LOC is **lead-gen, not transactions**. A write is almost always an *inquiry*:

1. Next.js posts to its own lightweight route `app/api/contact/route.ts`, which proxies to FastAPI `POST /api/v1/contact` (keeps secrets server-side).
2. `contact` service persists the lead and triggers `notify_partner()` (email/webhook to the provider or landlord).
3. Any write **invalidates the relevant cache keys in the same service method** — no stale listings after an edit.

There is **no booking engine and no checkout**. Digital products redirect to Gumroad/Lemon Squeezy; experiences/properties end in an inquiry form or referral link.

## Data model (Phase 1)

Four core tables, each mirrored by a `*Create/*Read/*Update` schema.

> **Implementation note:** The initial scaffold used `price_range: str` and `image_url: str`.
> Both must be migrated before the first filtering story ships (INFRA-4).

### experiences
| column | type | notes |
|---|---|---|
| id | UUID (str) | pk |
| slug | str | unique, indexed |
| title | str | |
| description | text | |
| category | str | indexed — drives filter |
| location | str | indexed |
| price_min | float | enables numeric filter/sort |
| price_max | float | enables numeric filter/sort |
| provider_name | str | |
| provider_contact | str | email or WhatsApp — routed by `notify_partner()` |
| images | JSONB (`[]`) | ordered list of URLs |
| is_featured | bool | default False — drives homepage carousel |
| referral_url | str | tagged outbound link |
| search_vector | tsvector GENERATED | GIN-indexed, see `docs/SEARCH_STRATEGY.md` |

### properties
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique, indexed |
| title | str | |
| description | text | |
| type | str | apartment / villa / vacation-home / local-stay |
| location | str | indexed |
| price_min | float | |
| price_max | float | |
| owner_contact | str | routed to landlord by `notify_partner()` |
| images | JSONB (`[]`) | |
| listing_tier | str | standard / featured / premium — drives sort order and visual badge |

### products
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique |
| title | str | |
| description | text | |
| type | str | guide / map / photography / template |
| price | float | display only — purchase via `purchase_url` |
| cover_image | str | single URL (products don't need galleries) |
| purchase_url | str | Gumroad / Lemon Squeezy external link |

### blog_posts
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique, indexed |
| title | str | |
| excerpt | text | |
| content | text | HTML or MDX |
| cover_image | str | |
| tags | JSONB (`[]`) | replaces comma-separated string |
| published_at | datetime | |

### inquiries (lead engine — cross-cutting)
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| name | str | |
| email | str | |
| phone | str \| null | |
| message | text | |
| subject | str | maps to entity + action |
| source_type | str | experience / property / promote / general |
| source_id | str \| null | slug of the entity that triggered the inquiry |
| created_at | datetime | |

Every entity ties to a **revenue stream** (referral commission, lead/subscription fee, sponsored tier, direct sale, affiliate) — if a field serves none, it's deprioritized.

## Where search lives

Per `docs/SEARCH_STRATEGY.md`: Phase 1 keyword search (`tsvector` + GIN + `pg_trgm`) is a **repository** concern; the **service** owns filter-merging and caching. Phase 2 hybrid (pgvector + RRF) slots into the same two layers with no architectural change — embeddings are generated in the service at write time.

## Caching contract (two layers, kept in sync)

| Layer | Tool | TTL | Invalidation |
|---|---|---|---|
| Client | TanStack Query | `staleTime` 5m | background refetch |
| Server | fastapi-cache2 + Redis | 5m | explicit, on write, in the service method |

Key namespacing by domain: `experiences:{slug}`, `properties:list`, `blog:{slug}` — no collisions.

## API URL split (frontend)

Two env vars, never conflate them:

| Var | Used by | Value (dev) | Value (prod) |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Browser JS bundle | `http://localhost:8000` | `https://api.yourdomain.com` |
| `API_INTERNAL_URL` | Next.js server-side (API proxy route, SSR) | `http://backend:8000` | `http://backend:8000` (Docker internal) |

`app/api/contact/route.ts` reads `API_INTERNAL_URL` (server-only). TanStack Query hooks read `NEXT_PUBLIC_API_URL` (browser). Never expose `API_INTERNAL_URL` to the client — it's not prefixed `NEXT_PUBLIC_`.

## Boundaries / non-goals (Phase 1)

- No user auth yet — public platform first; `(dashboard)` route group and auth come later.
- No payment processing — external links only.
- Postgres runs locally/in Docker now; migrate to managed Postgres (Supabase/Railway) when auth + scale arrive. The `develope` branch is active; `main` is production-stable.
- `next.config.ts` must have `output: 'standalone'` before the production Docker image is built — without it, `.next/standalone` does not exist and the prod container fails to start.
