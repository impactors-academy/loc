import logging

from app.config import settings

logger = logging.getLogger(__name__)


def embed(text: str) -> list[float] | None:
    """Return a 1536-dim embedding for text, or None if embeddings are disabled."""
    if not settings.embeddings_enabled:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text.strip(),
        )
        return response.data[0].embedding
    except Exception:
        logger.exception("Embedding generation failed — falling back to keyword search")
        return None


def experience_text(title: str, description: str | None, location: str | None, category: str) -> str:
    parts = [title, location or "", category, description or ""]
    return " ".join(p for p in parts if p).strip()


def blog_text(title: str, excerpt: str | None, content: str | None) -> str:
    # Use excerpt + first 500 chars of content to keep token cost low
    parts = [title, excerpt or "", (content or "")[:500]]
    return " ".join(p for p in parts if p).strip()
