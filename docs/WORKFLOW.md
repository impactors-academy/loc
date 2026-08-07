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

**Without Docker** (faster for frontend-only work):
```bash
cd frontend && npm install && npm run dev
```

For backend-only:
```bash
cd backend && uv sync && uv run uvicorn app.main:app --reload
```

## 2. Branching model

- **`main`** — production-stable. Vercel and Railway auto-deploy from here.
- **`develope`** — active integration branch (note the existing spelling).
- **`feature/<short-name>`** — branch off `develope`, PR back into `develope`.
- Release: PR `develope → main` once a slice is verified.

```
feature/disc-search-hero ──PR──► develope ──PR──► main ──deploy──► prod (Vercel + Railway)
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

## 8. Deployment (Vercel + Railway)

| Service | Platform | Trigger | Config |
|---|---|---|---|
| Frontend | Vercel | Push to `main` | Auto-detected Next.js; `NEXT_PUBLIC_API_URL` env var set to Railway backend URL |
| Backend | Railway | Push to `main` | `railway.toml` at repo root; `backend/Dockerfile` |
| PostgreSQL | Railway | Managed service | `DATABASE_URL` injected by Railway |
| Redis | Railway | Managed service | `REDIS_URL` injected by Railway |

**Vercel caveat:** Hobby plan blocks deployments from commit authors who aren't the project owner on private repos. Either upgrade to Pro or make the repo public to allow CI/CD from all contributors.

**Railway start command** (from `railway.toml`):
```
uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

Health check: `GET /health` — Railway polls this before marking the deploy live.

## 9. Environment variables reference

| Var | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Backend | `postgresql+psycopg2://user:pass@host:5432/db` |
| `REDIS_URL` | ✅ Backend | `redis://host:6379` |
| `NEXT_PUBLIC_API_URL` | ✅ Frontend | Railway backend public URL (e.g. `https://loc-backend.up.railway.app`) |
| `OPENAI_API_KEY` | ⬜ Optional | Enables embedding generation; if unset, embeddings are skipped silently |
| `NEXT_BUILD_STANDALONE` | ⬜ Docker only | Set to `true` inside `frontend/Dockerfile`; omit on Vercel |

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
