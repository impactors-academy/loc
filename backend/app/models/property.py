import uuid

from sqlalchemy import Float, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String, nullable=False, index=True)
    country: Mapped[str | None] = mapped_column(String, index=True)
    location: Mapped[str | None] = mapped_column(String, index=True)
    price_min: Mapped[float | None] = mapped_column(Float)
    price_max: Mapped[float | None] = mapped_column(Float)
    images: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    listing_tier: Mapped[str] = mapped_column(String, nullable=False, default="standard")
    owner_contact: Mapped[str | None] = mapped_column(String)
