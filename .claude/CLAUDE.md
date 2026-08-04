# loc — Session Protocol

Platform type: **API Backend (FastAPI) + Marketing Website (Next.js frontend)**
Stack: FastAPI · SQLAlchemy · Alembic · Postgres · Redis · Next.js · Docker
Live at: Frontend on Vercel · Backend + DB + Redis on Railway → migrating to Coolify
Active branch: `develope` (rename to `develop` — Phase 0B item)

---

## Reference docs — read when triggered

| Doc | Read when |
|---|---|
| `docs/BUILD-CHECKLIST.md` | **Every session start** — audit against code, update before committing |
| `docs/WORKFLOW.md` | Content workflow · editorial process · partner onboarding |
| `docs/ARCHITECTURE.md` | DB schema · API structure · service boundaries |
| `docs/ORG-STATUS.md` | Cross-project dependencies · Coolify migration status |
| `[workspace]/docs/PLATFORM-STANDARDS.md` → API Backend section | New endpoint types · auth · search · payments · Railway→Coolify migration |
| `[workspace]/docs/DEVOPS-GUIDE.md` | CI for Python · branch strategy · migration runbook |
| `[workspace]/MASTER-CHECKLIST.md` | Security (Phase 0C) · R4 discovery features · scaling (Phase 7) |

---

## On every session start

1. Read `docs/BUILD-CHECKLIST.md` in full — active branch is `develope`.
2. Audit every unchecked item against actual code.
3. Note ambiguous items as **Open Flags** — ask before acting.
4. Check `docs/ORG-STATUS.md` for stale cross-project info.
5. Report 1–3 next items in priority order before starting.

## On every session end

1. Update `docs/BUILD-CHECKLIST.md` — every completed item, one-line note.
2. Commit in the same commit as the code it describes.
3. Push to `origin` (github.com/impactors-academy/loc) from this directory.

---

## Skills — invoke by task (never default to generic)

### Plan & Architecture
| Task | Skill |
|---|---|
| API endpoint design, contract-first planning | `/api-design-reviewer` |
| DB schema design (experiences, stays, leads) | `/database-schema-designer` |
| DB migration strategy (Alembic) | `/migration-architect` |
| Service boundary decisions | `/senior-architect` |
| Analytics event planning | `/analytics-tracking` |

### Backend (FastAPI)
| Task | Skill |
|---|---|
| FastAPI route, Pydantic model, async DB query | `/senior-backend` |
| SQLAlchemy ORM, Alembic migration | `/senior-backend` · `/migration-architect` |
| Background tasks, Celery worker | `/senior-backend` |
| Redis caching, rate limiting (slowapi) | `/senior-backend` |
| API versioning, pagination, error format | `/api-design-reviewer` |
| CSV export, reporting endpoints | `/senior-backend` · `/senior-data-engineer` |

### Frontend (Next.js)
| Task | Skill |
|---|---|
| Next.js pages, components, Tailwind | `/senior-frontend` |
| Experience/stay card UI, grid, filters | `/senior-frontend` · `/ui-ux-pro-max` |
| Search bar (DISC-1), destination tiles (DISC-2) | `/senior-frontend` · `/gsap-scrolltrigger` for animations |
| Design decisions, palette, typography | `/ui-ux-pro-max` |

### Search & Discovery (R4)
| Task | Skill |
|---|---|
| DISC-1 hero search bar | `/senior-frontend` · `/senior-backend` |
| DISC-2 popular destinations section | `/senior-frontend` |
| DISC-3 country filter | `/senior-backend` · `/senior-frontend` |
| Meilisearch integration (Horizon 2) | `/senior-backend` |

### Testing & QA
| Task | Skill |
|---|---|
| pytest suite for FastAPI routes | `/api-test-suite-builder` · `/tdd-guide` |
| Contract tests (editor auth, CSV export) | `/api-test-suite-builder` |
| Frontend testing | `/senior-qa` |
| Load testing API | `/senior-qa` |

### Security
| Task | Skill |
|---|---|
| FastAPI security headers middleware | `/senior-secops` |
| Editor key auth, CORS lockdown | `/senior-secops` |
| Rate limiting (slowapi), input validation | `/senior-secops` · `/senior-backend` |
| Dependency audit (pip audit) | `/skill-security-auditor` |
| Pen testing API routes | `/security-pen-testing` |

### DevOps & Deploy
| Task | Skill |
|---|---|
| Railway → Coolify migration | `/senior-devops` |
| Docker Compose, multi-service setup | `/docker-development` · `/senior-devops` |
| GitHub Actions CI (pytest + docker build) | `/ci-cd-pipeline-builder` |
| Postgres backup, pg_dump → R2 | `/senior-devops` |
| Nginx config, reverse proxy | `/senior-devops` |

### Analytics & Observability
| Task | Skill |
|---|---|
| Umami analytics on frontend | `/analytics-tracking` |
| API metrics (Prometheus exporter) | `/observability-designer` |
| Structured logging (JSON → Loki) | `/senior-devops` |

---

## DevOps rules

```
Active branch: develope (→ rename to develop — Phase 0B item)
Branches:   feature/* → develope → main
CI:         GitHub Actions — pytest + docker build before merge (Phase 0B item)
Staging:    develope → Railway staging → Coolify staging (after migration)
Production: main → Railway → Coolify (after migration)
Release:    git tag vX.Y.Z + CHANGELOG.md after merge to main
```

## Security rules

```
Editor auth:  require_editor_key on ALL POST/PUT/DELETE endpoints ✓
CORS:         CORSMiddleware — verify no wildcard * in production
Headers:      FastAPI after_request security headers — pending (Phase 0C-5)
Rate limit:   slowapi on write endpoints — pending (Phase 0C-6)
CSV export:   /api/v1/leads/export.csv gated behind editor key ✓
```

## Platform-specific rules

- NEVER implement in-house checkout/payment — always link to provider
- API versioning: `/api/v1/` on all endpoints — never remove or rename existing routes
- LOC is discovery + inquiry only — bookings go to external provider systems
- `source_type + source_id` on all inquiries (LEAD-3 pattern) — maintain always
- Python: async FastAPI throughout · Pydantic v2 models on all request/response shapes
- R4 active: DISC-1 → DISC-5 are the current priority feature set
- Pending: EXP-5 referral links · STAY-4 partner notifications
