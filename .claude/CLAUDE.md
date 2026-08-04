# loc — Session Protocol

Platform type: **API Backend (FastAPI) + Marketing Website (Next.js)**
Stack: FastAPI · SQLAlchemy · Postgres · Redis · Next.js (frontend)
Live at: Frontend on Vercel · Backend + DB + Redis on Railway (migrating to Coolify)
Active branch: `develope` (rename to `develop` — Phase 0B item)

---

## Reference docs — read when triggered

| Doc | Read when |
|---|---|
| `docs/BUILD-CHECKLIST.md` | **Every session start** — audit against code, update before committing |
| `docs/WORKFLOW.md` | Understanding the LOC content workflow · editorial process · partner onboarding |
| `docs/ARCHITECTURE.md` | DB schema · API structure · service boundaries |
| `docs/ORG-STATUS.md` | Cross-project work · checking if Coolify migration is ready |
| `[workspace]/docs/PLATFORM-STANDARDS.md` | Adding a new API endpoint type · choosing auth · adding search or payments |
| `[workspace]/docs/DEVOPS-GUIDE.md` | CI setup · branch strategy · Railway→Coolify migration · cutting a release |
| `[workspace]/MASTER-CHECKLIST.md` | Security work (Phase 0C) · R4 discovery features (Phase 4) · scaling (Phase 7) |

---

## On every session start

1. Read `docs/BUILD-CHECKLIST.md` in full — active branch is `develope`.
2. Audit every unchecked item against actual code — not intentions, not filenames.
3. Note ambiguous items as **Open Flags** — ask before acting on them.
4. Check `docs/ORG-STATUS.md` for stale cross-project info — flag if outdated.
5. Report the 1–3 next items to tackle, in priority order, with one-line reasons.

## On every session end

1. Update `docs/BUILD-CHECKLIST.md` — every completed item, one-line note on what was built.
2. Commit in the same commit as the code it describes.
3. Push to `origin` (github.com/impactors-academy/loc) from this directory.

---

## DevOps rules (see `[workspace]/docs/DEVOPS-GUIDE.md` for full guide)

```
Active branch: develope (→ rename to develop as Phase 0B item)
Branches:   feature/* → develope → main
CI:         GitHub Actions — pytest + build must pass before merge (Phase 0B item)
Staging:    develope → Railway staging OR Coolify staging (once migrated)
Production: main → Railway (current) → Coolify (after migration)
Release:    git tag vX.Y.Z + CHANGELOG.md update after merge to main
```

## Security rules (see Phase 0C in `[workspace]/MASTER-CHECKLIST.md`)

```
Editor auth:   require_editor_key on all POST/PUT/DELETE endpoints ✓ (confirmed 2026-08-03)
Headers:       Add FastAPI middleware with security headers (Phase 0C-5 item)
Rate limiting: slowapi on auth + write endpoints (Phase 0C-6 item)
CORS:          CORSMiddleware — verify no wildcard * in production
CSV export:    GET /api/v1/leads/export.csv gated behind editor key ✓
```

## Platform-specific rules

- Never implement in-house checkout/payment — always link out to provider
- API versioning: `/api/v1/` on all endpoints — never break existing integrations
- LOC is a discovery + inquiry platform — bookings go to external provider systems
- R4 active: DISC-1 through DISC-5 are the current priority feature set
- `source_type + source_id` on all inquiries (LEAD-3 done) — maintain this pattern
- Python: use async FastAPI throughout; Pydantic v2 models on all request/response
