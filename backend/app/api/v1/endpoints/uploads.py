from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.config import settings
from app.core.deps import require_editor_key
from app.core.r2 import ALLOWED_CONTENT_TYPES, build_object_key, presign_put, public_url

router = APIRouter(prefix="/uploads", tags=["uploads"])


class PresignRequest(BaseModel):
    content_type: str


class PresignResponse(BaseModel):
    upload_url: str
    public_url: str


@router.post("/presign", response_model=PresignResponse, dependencies=[Depends(require_editor_key)])
async def presign_image_upload(data: PresignRequest):
    """Mint a short-lived presigned PUT URL for a property/experience/product image.

    The browser uploads straight to R2 with this URL; nothing is proxied
    through this server. Call this once per file, PUT the bytes to
    `upload_url`, then save `public_url` on the record.
    """
    if not settings.r2_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="R2 is not configured on this server (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)",
        )
    if data.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported content type. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )
    key = build_object_key(data.content_type)
    return PresignResponse(upload_url=presign_put(key, data.content_type), public_url=public_url(key))
