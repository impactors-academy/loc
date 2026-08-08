# LOC — Agent Protocol

Read this file before writing any code in this repo. Compatible with Claude Code,
OpenClaw, and any other AI coding agent. For deep LOC platform context, read `SKILL.md`.

## What LOC is

Global digital tourism connector + media brand. Earns via referrals, leads, featured
placements, and digital product sales. **Never** implements an in-house checkout —
always links out to the provider's own booking system.

## Stack

```
loc/
├── frontend/     ← Next.js 15.3 App Router · TypeScript · Tailwind · shadcn/ui · framer-motion
└── backend/      ← FastAPI · Python 3.11+ · PostgreSQL 16 + pgvector · Redis · Alembic
```

**Branches:** `develope` = active work · `main` = production-stable
**Deployment:** Hostinger VPS via Coolify · DNS on Cloudflare · `docker-compose.coolify.yml`

## Session start — do this first, every time

1. Read `docs/BUILD-CHECKLIST.md` in full.
2. Read `docs/ORG-STATUS.md` if it exists — if it looks stale, note it.
3. Read `docs/WORKFLOW.md` for R4 active sprint context.
4. Audit unchecked items against actual code. Update checkboxes.
5. Report the 1–3 next items to tackle before writing any code.

## Session end

1. Update `docs/BUILD-CHECKLIST.md` — one line per completed item.
2. Commit checklist alongside code in the same commit.
3. Push to `develope` branch, not `main`. PR to `main` only when a release is stable.
4. Never push from the workspace root.

## Critical rules

- **Always work on `develope`, merge to `main` for releases only.**
- LOC earns via referrals/leads — never add a checkout, cart, or payment form.
- pgvector hybrid search (RRF) is the canonical search path — do not regress to
  FTS-only. Both paths must coexist until vector is proven stable in production.
- Every new listing type or filter needs a matching seed entry before it's testable.
- Editor API endpoints (`POST /api/v1/products` etc.) must be authenticated —
  this is an open security gap; gate before any new editor endpoints are added.
- `make migrate` must run clean after any Alembic change.
- CI must stay green: `ruff`, `pytest`, `eslint`, `tsc --noEmit`, `next build`.

## Key file locations

| What | Where |
|---|---|
| API routes | `backend/app/api/v1/` |
| Data models | `backend/app/models/` |
| Alembic migrations | `backend/alembic/versions/` |
| Frontend pages | `frontend/app/` |
| Frontend components | `frontend/components/` |
| User stories (epics) | `docs/USER_STORIES.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| Search strategy | `docs/SEARCH_STRATEGY.md` |
| Active sprint | `docs/WORKFLOW.md` |

## Brand tokens (do not hardcode hex values)

```css
--loc-terracotta: #C4714A;   /* Primary CTA, category badges */
--loc-sand:       #F7EDD8;   /* Background highlights */
--loc-amber:      #D4A44C;   /* Accents, featured badges */
--loc-teal:       #2D6A6A;   /* Secondary accent */
--loc-night:      #1A1A2E;   /* Dark backgrounds, text */
--loc-stone:      #8B7355;   /* Muted text, subtitles */
```

## Skills to invoke (Claude Code)

`/loc` (SKILL.md) for all platform decisions · `/senior-secops` for API auth ·
`/ui-ux-pro-max` for UI/layout · `/senior-backend` for FastAPI/pgvector work ·
`/senior-data-engineer` for Alembic migrations and query optimization
