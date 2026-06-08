# LOC backend — FastAPI on Python 3.11, managed with uv.
# Builds a production image; the dev compose overrides CMD to add --reload.

FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

# uv binary
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

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
