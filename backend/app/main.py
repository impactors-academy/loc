from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.router import router as v1_router
from app.config import settings
from app.core.rate_limit import limiter
from app.core.security_headers import SecurityHeadersMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis = aioredis.from_url(settings.redis_url, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="loc-cache")
    yield
    await redis.close()


app = FastAPI(title="LOC API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/", tags=["meta"])
def root():
    """Index for anyone who opens the API host directly.

    Without this, `GET /` returns a bare {"detail":"Not Found"}, which reads
    like the service is broken when it is simply the wrong path.
    """
    return {
        "service": app.title,
        "version": app.version,
        "status": "ok",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "experiences": "/api/v1/experiences/",
            "stays": "/api/v1/properties/",
            "products": "/api/v1/products/",
            "blog": "/api/v1/blog/",
            "contact": "/api/v1/contact/",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok"}
