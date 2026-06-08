# LOC — Development Workflow

End-to-end process for taking LOC from local dev to production with a lean team.

## 1. Local setup (Docker drives everything)

```bash
git clone <repo> && cd loc
git checkout develope
cp .env.example .env
docker compose up            # or: make up
```

This starts four services: `db` (Postgres+pgvector), `redis`, `backend` (FastAPI, hot reload), `frontend` (Next.js, hot reload).

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
- No local Python/Node/Postgres install needed — the only prerequisite is Docker.

## 2. Branching model

- **`main`** — production-stable. Deploys happen from here only.
- **`develope`** — active integration branch (note the existing spelling).
- **`feature/<short-name>`** — branch off `develope`, PR back into `develope`.
- Release: PR `develope → main` once a slice is verified.

```
feature/experience-filters ──PR──► develope ──PR──► main ──deploy──► prod
```

## 3. Commits & PRs

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- One PR = one vertical slice (e.g. "experiences list endpoint + hook + grid").
- PR description links the user story (e.g. `EXP-2`) and lists what was tested.
- At least one review before merge to `develope`.

## 4. Database migrations (always through Alembic)

Never hand-edit the schema. After changing a SQLAlchemy model:

```bash
make makemigration m="add experiences table"   # autogenerate
# review the generated file in alembic/versions/
make migrate                                    # apply (alembic upgrade head)
```

Migrations are committed with the code that needs them. A PR that changes a model **must** include its migration.

## 5. Definition of Done (per story)

- [ ] Endpoint follows `endpoints → services → repositories → models` (no skipped layers).
- [ ] Pydantic `*Read` schema returned (no raw ORM).
- [ ] Service-layer caching added + invalidated on write where relevant.
- [ ] Frontend data via a TanStack Query hook (no `useEffect` fetching); API call only through `lib/api.ts`.
- [ ] Mobile layout verified first, then desktop.
- [ ] Clear CTA present and wired to a revenue stream (inquiry / external purchase / referral).
- [ ] Migration included if the model changed.
- [ ] Tests for new endpoints (`make test`).

## 6. CI (recommended, lightweight)

On PR to `develope`/`main`, run in parallel:

1. **Backend** — `ruff` lint, `uv run pytest`.
2. **Frontend** — `eslint`, `tsc --noEmit`, `next build`.
3. **Build** — `docker compose build` to catch image breakage.

Keep it under a few minutes; this is a small team, not an enterprise gate.

## 7. Deployment

- Production images come from the same Dockerfiles via `make prod`
  (`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`).
- On the Hostinger VPS, **Coolify** consumes these Dockerfiles directly and handles TLS + restarts.
- Production differences: DB/Redis ports not exposed, `uvicorn --workers 4` (no reload), Next.js standalone server, secrets injected as real env vars (never committed).
- Promote only from `main`.

## 8. Sequencing discipline

Ship the lean, working version of each slice before layering sophistication:
**R0 foundations → core listings + inquiry (R1) → digital store + content (R2) → search/recommendations (R3).** Don't build admin dashboards or auth before the public platform is live.

See `docs/USER_STORIES.md` for the full backlog and release slices.
