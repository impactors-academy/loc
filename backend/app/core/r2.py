"""Cloudflare R2 client + presigned-upload helpers.

R2 is S3-compatible; region must be "auto" (a real AWS region fails signing).
Nothing here proxies file bytes through this server — the browser PUTs
directly to R2 using a short-lived presigned URL we generate.
"""

import uuid

import boto3
from botocore.client import Config

from app.config import settings

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}
MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB
PRESIGN_TTL_SECONDS = 300


def _client():
    return boto3.client(
        "s3",
        region_name="auto",
        endpoint_url=f"https://{settings.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
    )


def build_object_key(content_type: str, *, prefix: str = "properties") -> str:
    ext = ALLOWED_CONTENT_TYPES[content_type]
    return f"{prefix}/{uuid.uuid4().hex}.{ext}"


def presign_put(key: str, content_type: str) -> str:
    return _client().generate_presigned_url(
        "put_object",
        Params={"Bucket": settings.r2_bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=PRESIGN_TTL_SECONDS,
    )


def public_url(key: str) -> str:
    base = settings.r2_public_base_url.rstrip("/")
    return f"{base}/{key}"
