import json

import httpx
from fastapi import APIRouter, HTTPException, status
from fastapi_cache import FastAPICache

router = APIRouter(prefix="/fx", tags=["fx"])

# No-key, no-limit exchange-rate source. Rates move slowly enough that a
# 12h cache (below) is honest — nobody is transacting against this number,
# it's a "≈" convenience figure next to the listing's real price.
_FX_SOURCE = "https://open.er-api.com/v6/latest/{base}"
_CACHE_TTL = 43200


@router.get("/{base}")
async def get_rates(base: str):
    """Live exchange rates for `base`, used to show visitors a converted
    price estimate next to a listing's real currency. Never used to charge
    anyone — LOC has no in-house payments, see PLATFORM-STANDARDS.md.

    Caches manually via the raw redis client rather than fastapi-cache's
    @cache decorator: that decorator's JsonCoder unconditionally calls
    value.decode() assuming bytes back from redis, but this app's redis
    client is configured with decode_responses=True (main.py), so a real
    cache hit returns str and crashes with AttributeError. Every other
    @cache-decorated endpoint in this app is silently never hitting its
    cache (non-deterministic key), which is how that bug stayed hidden.
    """
    cache_key = f"loc-cache:fx:{base.upper()}"
    redis = FastAPICache.get_backend().redis  # type: ignore[attr-defined]

    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            res = await client.get(_FX_SOURCE.format(base=base.upper()))
        except httpx.HTTPError:
            raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "FX source unreachable")
    if res.status_code != 200:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "FX source error")
    body = res.json()
    if body.get("result") != "success":
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "FX source error")

    result = {"base": body["base_code"], "rates": body["rates"]}
    await redis.set(cache_key, json.dumps(result), ex=_CACHE_TTL)
    return result
