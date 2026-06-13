import uuid

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Experience(Base):
    __tablename__ = "experiences"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    location: Mapped[str | None] = mapped_column(String, index=True)
    price_min: Mapped[float | None] = mapped_column(Float)
    price_max: Mapped[float | None] = mapped_column(Float)
    images: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    provider_name: Mapped[str | None] = mapped_column(String)
    provider_contact: Mapped[str | None] = mapped_column(String)
    referral_url: Mapped[str | None] = mapped_column(String)
    embedding: Mapped[list | None] = mapped_column(Vector(1536), nullable=True)
