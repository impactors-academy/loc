#!/usr/bin/env bash
# Run the full LOC stack natively, without Docker.
#
# The documented path is `docker compose up`. This is the fallback for a machine
# with no Docker daemon: Postgres, Redis, the FastAPI backend and the Next.js
# frontend all run as local processes.
#
#   bash scripts/dev-local.sh          start everything
#   bash scripts/dev-local.sh stop     stop what this script started
#
# Prerequisites (Homebrew): postgresql@17+, pgvector, redis, uv, node.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS="$ROOT/.dev-local"
DB_URL="postgresql+psycopg2://loc:loc@localhost:5432/loc"
REDIS_URL="redis://localhost:6379/0"
EDITOR_KEY="${EDITOR_API_KEY:-dev-local-editor-key}"

mkdir -p "$LOGS"

# Local production build, served beside the dev server on its own port and its
# own build directory. This is the only honest way to check anything that only
# applies in production — the CSP and HSTS headers, and real bundle behaviour.
# It is built against the LOCAL API on purpose: pointed at api.loctravels.com,
# server-side fetches from a dev machine meet Cloudflare's bot challenge and the
# page renders with no data, which looks like a broken build.
if [ "${1:-start}" = "prod" ]; then
  cd "$ROOT/frontend"
  [ -d node_modules ] || npm install
  NEXT_DIST_DIR=.next-prod NEXT_PUBLIC_API_URL=http://localhost:8000 npm run build
  NEXT_DIST_DIR=.next-prod NEXT_PUBLIC_API_URL=http://localhost:8000 \
    API_INTERNAL_URL=http://localhost:8000 EDITOR_API_KEY="$EDITOR_KEY" \
    nohup npx next start -p 3001 > "$LOGS/frontend-prod.log" 2>&1 &
  echo $! > "$LOGS/frontend-prod.pid"
  for _ in $(seq 1 30); do
    code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/ || true)
    [ "$code" = "200" ] && break
    sleep 2
  done
  echo
  echo "  production build  http://localhost:3001   ($code)"
  echo "  This one carries the CSP and HSTS headers; the dev server does not."
  echo "  The backend must be running — start it with: bash scripts/dev-local.sh"
  echo
  exit 0
fi

if [ "${1:-start}" = "stop" ]; then
  for f in "$LOGS"/*.pid; do
    [ -e "$f" ] || continue
    kill "$(cat "$f")" 2>/dev/null && echo "stopped $(basename "$f" .pid)" || true
    rm -f "$f"
  done
  echo "Postgres and Redis were left running — stop them yourself if you want them down."
  exit 0
fi

need() { command -v "$1" >/dev/null || { echo "missing: $1"; exit 1; }; }
need psql; need uv; need npm

# --- Postgres ---------------------------------------------------------------
pg_isready -q || { echo "Postgres is not running. Try: brew services start postgresql@18"; exit 1; }

psql -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='loc'" | grep -q 1 || \
  psql -d postgres -qc "CREATE ROLE loc LOGIN PASSWORD 'loc' SUPERUSER"

for db in loc loc_test; do
  psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1 || createdb -O loc "$db"
  # pgvector is required by migration 003; pg_trgm by 002.
  psql -d "$db" -qc "CREATE EXTENSION IF NOT EXISTS vector; CREATE EXTENSION IF NOT EXISTS pg_trgm"
done

# --- Redis ------------------------------------------------------------------
# Started directly rather than via `brew services`: a global redis.conf that
# loads a module you do not have will abort the service, and that is not this
# project's problem to fix. Cache only, matching docker-compose.coolify.yml.
redis-cli ping >/dev/null 2>&1 || redis-server --port 6379 --save "" --appendonly no --daemonize yes
sleep 1
redis-cli ping >/dev/null || { echo "Redis would not start"; exit 1; }

# --- Backend ----------------------------------------------------------------
# Bound to :: rather than 127.0.0.1. On macOS `localhost` resolves to ::1 first,
# and a server listening only on IPv4 gives the browser ERR_CONNECTION_REFUSED
# on http://localhost:8000 while curl to 127.0.0.1 answers perfectly — so it
# looks like the API is down when it is running. `::` is dual-stack and answers
# both. The Node servers already bind both, which is why only the API broke.
cd "$ROOT/backend"
uv sync -q
DATABASE_URL="$DB_URL" uv run alembic upgrade head

if [ "$(psql -d loc -tAc 'SELECT count(*) FROM experiences')" = "0" ]; then
  DATABASE_URL="$DB_URL" PYTHONPATH=. uv run python scripts/seed.py
fi

DATABASE_URL="$DB_URL" REDIS_URL="$REDIS_URL" EDITOR_API_KEY="$EDITOR_KEY" \
  CORS_ORIGINS="http://localhost:3000" ENV=development \
  nohup uv run uvicorn app.main:app --host :: --port 8000 --reload \
  > "$LOGS/backend.log" 2>&1 &
echo $! > "$LOGS/backend.pid"

# --- Frontend ---------------------------------------------------------------
cd "$ROOT/frontend"
[ -d node_modules ] || npm install
# CF_ACCESS_* deliberately unset: middleware.ts stands aside in development,
# because there is no Cloudflare Access in front of a local dev server.
NEXT_PUBLIC_API_URL=http://localhost:8000 API_INTERNAL_URL=http://localhost:8000 \
  EDITOR_API_KEY="$EDITOR_KEY" \
  nohup npx next dev -p 3000 > "$LOGS/frontend.log" 2>&1 &
echo $! > "$LOGS/frontend.pid"

# --- Wait and report --------------------------------------------------------
for i in $(seq 1 30); do
  b=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/health || true)
  f=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ || true)
  [ "$b" = "200" ] && [ "$f" = "200" ] && break
  sleep 2
done

cat <<REPORT

  frontend   http://localhost:3000     ($f)
  API        http://localhost:8000     ($b)
  API docs   http://localhost:8000/docs
  admin      http://localhost:3000/admin   (Access check stands aside in dev)

  editor key $EDITOR_KEY
  logs       $LOGS/{backend,frontend}.log
  stop       bash scripts/dev-local.sh stop
  prod       bash scripts/dev-local.sh prod    → :3001, with CSP + HSTS

  Tests need the separate database — the suite drops every table on teardown:
    cd backend && DATABASE_URL=postgresql+psycopg2://loc:loc@localhost:5432/loc_test uv run pytest
REPORT
