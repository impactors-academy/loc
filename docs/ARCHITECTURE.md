# LOC — End-to-End Architecture

How a request flows across frontend, backend, and database, and where each rule from the project skill applies. This is the operating contract, not a restatement of the file tree.

## The stack at a glance

```
 Browser (mobile-first)
   │  HTTPS
   ▼
 Next.js 15.3 App Router
   ├── TanStack Query v5 (staleTime 5m, background refetch)
   ├── lib/api.ts (single fetch wrapper — the ONLY place fetch() lives)
   └── hooks/* (one file per domain — components call hooks, never api.ts directly)
   │  /api/v1/...
   ▼
 FastAPI
   endpoints/  →  services/  →  repositories/  →  models/   (strict one-way)
                     │
                     ├── fastapi-cache2 @cache()  ◄── Redis  (TTL 5m, invalidate on write)
                     ▼
                 PostgreSQL 16 + pgvector
                   ├── pg_trgm (fuzzy/typo FTS)
                   ├── tsvector GIN index (keyword search)
                   └── vector(1536) HNSW index (cosine similarity, hybrid search)
```

## Deployment topology

```
 GitHub (main branch)
   │
   ├── Vercel ← auto-deploys frontend on push to main
   │     Next.js native build (no standalone output on Vercel)
   │     NEXT_BUILD_STANDALONE=true only in frontend/Dockerfile (for Docker)
   │
   └── Railway ← auto-deploys backend on push to main
         railway.toml: DOCKERFILE builder → backend/Dockerfile
         start: uv run alembic upgrade head && uv run uvicorn ...
         services: backend (FastAPI) · PostgreSQL 16 · Redis
```

Key env vars:
| Var | Used by | Value (dev) | Value (prod) |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Browser JS | `http://localhost:8000` | Railway backend URL |
| `DATABASE_URL` | Backend | `postgresql+psycopg2://...` | Railway Postgres URL |
| `REDIS_URL` | Backend | `redis://localhost:6379` | Railway Redis URL |
| `OPENAI_API_KEY` | Backend (optional) | unset → embeddings disabled | set → embeddings on write |

`app/api/contact/route.ts` reads a server-only internal URL. TanStack Query hooks read `NEXT_PUBLIC_API_URL`. Never expose the internal URL client-side.

## Request lifecycle (read path — e.g. browsing experiences)

1. **Component** renders and calls a **hook** (`useExperiences()`), never `lib/api.ts` directly.
2. **TanStack Query** checks its client cache (`staleTime: 5m`). Fresh → no network. Stale → background refetch.
3. The hook calls **`lib/api.ts`**, hitting `GET /api/v1/experiences?...`.
4. **Endpoint** parses/validates query params (Pydantic), calls a **service**. No DB access, no logic here.
5. **Service** checks **Redis** via `@cache()`. Hit → return immediately. Miss → call **repository**, apply business rules, cache, return.
6. **Repository** runs the SQLAlchemy query — the only layer touching the DB.
7. Response serialised through a **Pydantic `*Read` schema** — ORM models never returned raw.

## Request lifecycle (write path — inquiry / lead capture)

LOC is **lead-gen, not transactions**. A write is almost always an *inquiry*:

1. Next.js posts to `app/api/contact/route.ts` (server-side proxy → keeps secrets out of the browser).
2. Proxy forwards to FastAPI `POST /api/v1/contact`.
3. `contact` service persists the lead and triggers `notify_partner()` (email/webhook to the provider or landlord).
4. Any write **invalidates the relevant cache keys in the same service method**.

There is **no booking engine and no checkout**. Digital products redirect to Gumroad/Lemon Squeezy; experiences/properties end in an inquiry form or referral link.

## Data model (current — migration 004)

Four core entity tables, plus the inquiry cross-cutting table. All carry camelCase API aliases via `pydantic.alias_generators.to_camel`.

### experiences
| column | type | notes |
|---|---|---|
| id | UUID (str) | pk |
| slug | str | unique, indexed |
| title | str | |
| description | text | |
| category | str | indexed — `adventure/wellness/culture/culinary/water/aerial` |
| country | str \| null | indexed — added migration 004 (global expansion) |
| location | str | indexed — city/region within country |
| duration | str \| null | display only — "2 hours", "Full day" |
| price_min | float | |
| price_max | float | |
| images | JSONB (`[]`) | ordered URLs |
| is_featured | bool | drives homepage carousel |
| provider_name | str | |
| provider_contact | str | email or WhatsApp |
| referral_url | str | tagged outbound link |
| embedding | vector(1536) | pgvector — null until OPENAI_API_KEY set |
| search_vector | tsvector GENERATED | GIN-indexed for FTS |

### properties
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique, indexed |
| title | str | |
| description | text | |
| type | str | `villa/apartment/riad/ryokan/gite/hotel/bivouac` |
| country | str \| null | indexed — added migration 004 |
| location | str | indexed |
| price_min | float | |
| price_max | float | |
| images | JSONB (`[]`) | |
| listing_tier | str | `standard/featured/premium` — drives sort + badge |
| owner_contact | str | routed to landlord by `notify_partner()` |

### products
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique |
| title | str | |
| description | text | |
| type | str | `guide/itinerary/course/map/photography/template` |
| price | float | display only |
| image_url | str | single cover URL |
| purchase_url | str | Gumroad / Lemon Squeezy |

### blog_posts
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| slug | str | unique, indexed |
| title | str | |
| excerpt | text | |
| content | text | HTML |
| image_url | str | |
| tags | str | comma-separated string |
| published_at | datetime | |
| embedding | vector(1536) | for `GET /blog/{slug}/related` (vector cosine fallback: tag overlap) |

### inquiries (lead engine — cross-cutting)
| column | type | notes |
|---|---|---|
| id | UUID | pk |
| name | str | |
| email | str | |
| phone | str \| null | |
| message | text | |
| subject | str | maps to entity + action |
| source_type | str | `experience/property/promote/general` |
| source_id | str \| null | slug of the triggering entity |
| created_at | datetime | |

Every entity ties to a **revenue stream** (referral commission, lead fee, sponsored tier, direct sale, affiliate). If a field serves none, it's deprioritised.

## Search architecture (Phase 2 active — hybrid)

Full detail in `docs/SEARCH_STRATEGY.md`. Summary:

- **Keyword arm:** `tsvector` GIN on title+description+location+category; `pg_trgm` for typo tolerance.
- **Vector arm:** `embedding vector(1536)` cosine via pgvector HNSW — generated at write time if `OPENAI_API_KEY` is set; column stays `null` otherwise (no cost if key unset).
- **Fusion:** Reciprocal Rank Fusion `score = Σ 1/(k+rank)` where k=60 — merges both ranked lists in Python, re-fetches ORM objects sorted by fused rank.
- **Blog related:** `GET /blog/{slug}/related` — vector cosine similarity; falls back to tag overlap if embeddings null.
- **Embeddings enabled gate:** `settings.embeddings_enabled` = `bool(OPENAI_API_KEY)` — gated at the service layer, zero cost if key not set.

## Image strategy

`frontend/lib/images.ts` maintains a curated Unsplash photo pool keyed by `category` (experience) or `type` (property). `getPoolImage(categoryOrType, slug)` returns a deterministic-but-varied URL via slug-char-sum hash. Used as fallback when no `images[]` are stored in the DB.

## Caching contract (two layers, kept in sync)

| Layer | Tool | TTL | Invalidation |
|---|---|---|---|
| Client | TanStack Query | `staleTime` 5m | background refetch |
| Server | fastapi-cache2 + Redis | 5m | explicit, on write, in the service method |

Key namespacing: `experiences:{slug}`, `properties:list`, `blog:{slug}` — no collisions.

## Boundaries / non-goals (current phase)

- No user auth yet — public platform first; `(dashboard)` route group and auth come later.
- No payment processing — external links only.
- No dedicated vector DB (Pinecone/Weaviate) — pgvector inside Postgres is sufficient at this scale.
- Postgres runs on Railway; frontend on Vercel. No Coolify/VPS in current deployment plan.
- `next.config.ts` has conditional `output: standalone` — enabled only when `NEXT_BUILD_STANDALONE=true` (Docker builds), disabled for Vercel native pipeline.
