# LOC — Deployment

**Target:** Hostinger VPS via Coolify · DNS on Cloudflare · `loctravels.com`

Coolify builds from `docker-compose.yml` + `docker-compose.prod.yml` and manages the
containers itself. There is no deploy workflow in `.github/` — Coolify deploys from its
own git integration. Do not add one back; two systems managing the same containers will
fight each other.

---

## Services

| Service | Image / build | Port | Public | Notes |
|---|---|---|---|---|
| `db` | `pgvector/pgvector:pg16` | 5432 | **no** | Volume `loc_pgdata`. pgvector needed for EXP-6 hybrid search |
| `redis` | `redis:7-alpine` | 6379 | **no** | Cache only — `--save "" --appendonly no`, nothing to persist |
| `backend` | `backend/Dockerfile` | 8000 | yes | Runs `alembic upgrade head` then uvicorn, 4 workers |
| `frontend` | `frontend/Dockerfile` | 3000 | yes | Next.js standalone (`node server.js`) |
| `pgadmin` | — | — | **no** | `replicas: 0` in prod. Do not expose it |

The prod override closes the `db` and `redis` port mappings. They stay reachable inside
the compose network only. Never publish them.

---

## Domains

The browser talks to the API directly (the public client uses `NEXT_PUBLIC_API_URL`), so
the backend needs its own public hostname. Path-based routing on one domain does not work
here — Next.js already owns `/api/*` for its own route handlers.

| Domain | → service | Cloudflare |
|---|---|---|
| `loctravels.com` | `frontend:3000` | Proxied (orange) |
| `api.loctravels.com` | `backend:8000` | Proxied (orange) |

SSL/TLS mode **Full (Strict)** — not Flexible.

---

## Environment variables

Set these in the Coolify UI, not in the repo. Once Vaultwarden is live (Phase 1) they
should come from there.

### Shared / compose-level

```
POSTGRES_USER=loc
POSTGRES_PASSWORD=<strong unique value>
POSTGRES_DB=loc
EDITOR_API_KEY=<openssl rand -hex 32>
```

### backend

```
DATABASE_URL      postgresql+psycopg2://loc:<password>@db:5432/loc
REDIS_URL         redis://redis:6379/0
CORS_ORIGINS      ["https://loctravels.com"]
EDITOR_API_KEY    <same value as above>
ENV               production
EMAIL_FROM        noreply@loctravels.com
OPENAI_API_KEY    (blank = keyword search only; set to enable pgvector hybrid search)
SMTP_*            (blank = inquiries logged, no email sent — STAY-4)
```

### frontend

```
NEXT_PUBLIC_API_URL   https://api.loctravels.com   ← BUILD ARG, see below
API_INTERNAL_URL      http://backend:8000
EDITOR_API_KEY        <same value as above>        ← runtime only
NODE_ENV              production
```

**Two things that will bite you:**

`NEXT_PUBLIC_API_URL` is baked into the browser bundle at **build** time, so it must be
passed as a build argument — setting it only at runtime leaves the compiled bundle
pointing at `localhost:8000`. The prod compose already wires it as a build arg. Changing
it requires a rebuild, not a restart.

`EDITOR_API_KEY` is the opposite: **runtime only, never a build arg, never
`NEXT_PUBLIC_*`**. It gates every write endpoint and all `/leads` routes. Prefixing it
`NEXT_PUBLIC_` would inline it into the bundle where any visitor could read it and gain
full write access to the API. The `/api/admin/*` proxy reads it per request on the server.

Both services fail closed if it is missing — the prod compose refuses to start rather
than serving 503s on every editor route.

---

## Cloudflare Access — required before first deploy

`/admin` has **no login of its own.** The `/api/admin/*` proxy attaches the editor key to
whatever it forwards, so anyone who can reach it can write. Access is the only thing
standing in front of the CMS.

Protect **both** paths — the page alone is not enough:

```
loctravels.com/admin*
loctravels.com/api/admin/*
```

Policy: allow only the `@impactorsacademy.com` email domain. Method: email OTP now,
Authentik OIDC once Authentik is live (Phase 1). Enable Access audit logs.

Deploying without this puts a writable CMS and your customer inquiry list — names, emails,
phone numbers — on the public internet.

---

## First deploy — order matters

1. **Merge `develope` → `main`.** `main` does not have editor auth. Deploying it as it
   stands ships an unauthenticated write API.
2. Create the Coolify project, pointed at this repo, branch `main`, using
   `docker-compose.yml` + `docker-compose.prod.yml`.
3. Set every env var above.
4. Add both domains in Coolify; add the matching DNS records in Cloudflare (proxied).
5. Configure Cloudflare Access on both admin paths.
6. Deploy.
7. Verify (below).
8. Add `loctravels.com` and `api.loctravels.com/health` to Uptime Kuma.

Migrations run automatically — the backend command is
`alembic upgrade head && uvicorn ...`. On a fresh database run the seed manually once:

```bash
docker compose exec backend sh -c "PYTHONPATH=. uv run python scripts/seed.py"
```

---

## Post-deploy verification

```bash
curl -s https://api.loctravels.com/health                      # {"status":"ok"}
curl -s https://loctravels.com/ -o /dev/null -w '%{http_code}' # 200

# Editor auth must be live — expect 403, NOT 201
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  https://api.loctravels.com/api/v1/experiences/ \
  -H 'Content-Type: application/json' -d '{}'

# Customer PII must not be public — expect 403
curl -s -o /dev/null -w '%{http_code}\n' https://api.loctravels.com/api/v1/leads/

# Cloudflare Access must challenge these — expect a login redirect, not 200
curl -s -o /dev/null -w '%{http_code}\n' https://loctravels.com/admin
curl -s -o /dev/null -w '%{http_code}\n' https://loctravels.com/api/admin/leads
```

Any `200` or `201` above is a failure. Stop and fix before announcing the site.

Then run `securityheaders.com` against both domains — note the backend still ships no
security headers (0C-5 open item).

---

## Backups

Not yet configured. Before real inquiries accumulate, add a `pg_dump` cron to
Cloudflare R2 per 0C-7 — daily, encrypted, 30-day retention, with a restore test.
`redis` needs no backup; it is a cache and persistence is deliberately off.
