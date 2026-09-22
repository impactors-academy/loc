# LOC — Development Workflow

End-to-end process for taking LOC from local dev to production with a lean team.

## 1. Local setup

```bash
git clone https://github.com/impactors-academy/loc.git && cd loc
git checkout develope
cp backend/.env.example backend/.env   # fill DATABASE_URL, REDIS_URL
docker compose up                       # or: make up
```

Four services start: `db` (Postgres 16 + pgvector), `redis`, `backend` (FastAPI, hot reload on :8000), `frontend` (Next.js, hot reload on :3000).

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

No local Python/Node/Postgres install needed — Docker is the only prerequisite.

### Without Docker — the whole stack

On a machine with no Docker daemon, run everything natively:

```bash
bash scripts/dev-local.sh          # start
bash scripts/dev-local.sh stop     # stop the two app processes
```

It creates the `loc` and `loc_test` databases with `vector` + `pg_trgm`, runs
migrations, seeds if the tables are empty, and starts backend and frontend with
the env vars pointed at `localhost` instead of the compose service names.

Needs Homebrew `postgresql@17+`, `pgvector`, `redis`, `uv` and `node`. It starts
Redis directly rather than through `brew services` — a global `redis.conf` that
loads a module you do not have will abort the service, and that is not this
project's problem to work around.

**Cloudflare Access stands aside in development.** `frontend/middleware.ts` has
nothing to verify without Access in front of it, so `/admin` is reachable locally
with no token. That is deliberate: a check that cannot pass locally gets disabled
locally. It fails closed in production.

Single-service alternatives:
```bash
cd frontend && npm install && npm run dev
cd backend && uv sync && uv run uvicorn app.main:app --reload
```

### Running the tests

```bash
cd backend
DATABASE_URL=postgresql+psycopg2://loc:loc@localhost:5432/loc_test uv run pytest
```

**The suite drops every table on teardown** (`Base.metadata.drop_all` in
`tests/conftest.py`). Pointed at a development database it deletes all your data,
passes, and says nothing — the damage surfaces the next time you start the app.
`conftest.py` now refuses any database whose name does not end in `_test` or
start with `test_`. Do not remove that guard.

## 2. Branching model

- **`main`** — production-stable. Coolify deploys from here.
- **`develope`** — active integration branch (note the existing spelling).
- **`feature/<short-name>`** — branch off `develope`, PR back into `develope`.
- Release: PR `develope → main` once a slice is verified.

```
feature/disc-search-hero ──PR──► develope ──PR──► main ──deploy──► prod (Coolify)
```

## 3. Commits & PRs

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- One PR = one vertical slice (e.g. "hero search bar + experiences endpoint country filter").
- PR description links the user story (e.g. `DISC-1`) and lists what was tested.
- At least one review before merge to `develope`.

## 4. Database migrations (always through Alembic)

Never hand-edit the schema. After changing a SQLAlchemy model:

```bash
cd backend
uv run alembic revision --autogenerate -m "add country to experiences"
# review the generated file in alembic/versions/
uv run alembic upgrade head
```

Or via make:
```bash
make makemigration m="add country to experiences"
make migrate
```

Migrations are committed with the code that needs them. A PR that changes a model **must** include its migration. Migration chain: `001 → 002 → 003 → 004 → ...`

## 5. Seeding local data

```bash
cd backend && uv run python -m scripts.seed
```

The seed is idempotent (checks slug before inserting) and covers:
- 10 global experiences (Japan, France, UK, Belgium, Bali, Greece, Italy, Morocco)
- 6 global properties (France, UK, Japan, Bali, Morocco)
- 3 digital products (bundles, itinerary pack, video course)
- 3 blog posts (global topics)

Embeddings are generated automatically if `OPENAI_API_KEY` is set; skipped silently if not.

## 6. Definition of Done (per story)

- [ ] Endpoint follows `endpoints → services → repositories → models` (no skipped layers).
- [ ] Pydantic `*Read` schema returned (no raw ORM).
- [ ] Service-layer caching added + invalidated on write where relevant.
- [ ] Frontend data via a TanStack Query hook; API call only through `lib/api.ts`.
- [ ] Mobile layout verified first, then desktop.
- [ ] Clear CTA present and wired to a revenue stream (inquiry / external purchase / referral).
- [ ] Migration included if the model changed.
- [ ] Tests for new endpoints (`make test`).
- [ ] No Morocco-only copy introduced — use global language.
- [ ] Stage gate: feature belongs to the current stage (S1 = discovery/lead-gen). Stage 2+ work (affiliate automation, booking flows, payments) must be explicitly planned and approved before implementation.

## 7. CI (GitHub Actions)

On every push to `develope` and `main`, runs in parallel:

1. **Backend** — `ruff` lint, `uv run pytest` against `pgvector/pgvector:pg16` Postgres service.
2. **Frontend** — `eslint`, `tsc --noEmit`, `next build`.
3. CI postgres must use `pgvector/pgvector:pg16` image (not `postgres:16`) — the extension is required.

Keep it under a few minutes; this is a small team.

## 8. Deployment (Coolify)

Full detail — services, domains, env vars, first-deploy steps — is in
`docs/DEPLOYMENT.md`. That file is authoritative; this is the summary.

| Service | Platform | Trigger | Config |
|---|---|---|---|
| Frontend | Coolify (Hostinger VPS) | Push to `main` | `frontend/Dockerfile`, Next.js standalone → `loctravels.com` |
| Backend | Coolify (Hostinger VPS) | Push to `main` | `backend/Dockerfile` → `api.loctravels.com` |
| PostgreSQL | Coolify container | Same stack | `pgvector/pgvector:pg16`, volume `loc_pgdata`, not publicly bound |
| Redis | Coolify container | Same stack | `redis:7-alpine`, cache only, not publicly bound |

Coolify builds **`docker-compose.coolify.yml`** — not `docker-compose.yml`, which is
the dev stack (hot reload, published DB ports, pgAdmin) and must never reach a public
host. Coolify deploys from its own git integration, so there is no deploy workflow in
`.github/`; adding one back gives two systems the same containers to fight over.

Backend start command (from `backend/Dockerfile`):
```
uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

Health check: `GET /health` — Coolify polls this before marking the deploy live.

## 9. Environment variables reference

| Var | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Backend | `postgresql+psycopg2://user:pass@host:5432/db` |
| `REDIS_URL` | ✅ Backend | `redis://host:6379` |
| `NEXT_PUBLIC_API_URL` | ✅ Frontend | Backend public URL — `https://api.loctravels.com` in prod |
| `OPENAI_API_KEY` | ⬜ Optional | Enables embedding generation; if unset, embeddings are skipped silently |
| `NEXT_BUILD_STANDALONE` | ⬜ Docker only | Set to `true` inside `frontend/Dockerfile`; omit for local `next build` |

Never commit `.env` — only `.env.example` is committed.

## 10. Sequencing discipline

Ship the lean, working version of each slice before layering sophistication:

```
R0 (foundations) → R1 (core listings + inquiry) → R2 (store + content) → R3 (hybrid search)
→ Global pivot → R4 (GYG-inspired discovery + destination pages) → Admin dashboard (internal CRUD)
→ R5 (auth gate + referral tracking) → R6 (affiliate + lead gen automation, Stage 2)
→ R7 (booking MVP, Stage 3) → R8 (full marketplace + payments, Stage 4)
```

**Strategic gate rule:** Do not expand to new geographies until Stage 3 booking automation is proven. Adding markets while manual ops dominate multiplies the bottleneck, not the revenue.

See `docs/USER_STORIES.md` for the full backlog and epic-level detail.
