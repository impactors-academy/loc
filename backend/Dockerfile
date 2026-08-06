# LOC backend — FastAPI on Python 3.11, managed with uv.
# Builds a production image; the dev compose overrides CMD to add --reload.

FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

# uv binary, from PyPI rather than `COPY --from=ghcr.io/astral-sh/uv`. The ghcr
# copy pulls a second registry at build time, so any environment that cannot reach
# ghcr.io (stale credentials, registry policy, an air-gapped runner) fails the
# build outright — the base image alone is not enough. PyPI is already required to
# install the app's dependencies, so this keeps the build on one registry.
# Pinned: uv is the resolver, so an unpinned build tool can change resolution.
RUN pip install --no-cache-dir "uv==0.12.1"

WORKDIR /app

# 1) Dependency layer — cached unless pyproject/uv.lock change.
#    Use --frozen once uv.lock is committed (reproducible prod builds).
COPY pyproject.toml uv.lock* ./
RUN uv sync --no-install-project --no-dev || uv sync --no-install-project

# 2) App layer
COPY . .
RUN uv sync --no-dev || true

EXPOSE 8000

# Default (production). Dev compose overrides with --reload.
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
