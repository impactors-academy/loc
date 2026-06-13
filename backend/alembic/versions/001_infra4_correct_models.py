"""INFRA-4: correct experience/property models and add inquiries table

Revision ID: 001infra4
Revises:
Create Date: 2026-06-13

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001infra4"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── experiences ────────────────────────────────────────────────────────────
    op.add_column("experiences", sa.Column("price_min", sa.Float(), nullable=True))
    op.add_column("experiences", sa.Column("price_max", sa.Float(), nullable=True))
    op.add_column(
        "experiences",
        sa.Column("images", postgresql.JSONB(), nullable=False, server_default="[]"),
    )
    op.add_column(
        "experiences",
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column("experiences", sa.Column("provider_contact", sa.String(), nullable=True))
    op.add_column("experiences", sa.Column("location", sa.String(), nullable=True))
    op.drop_column("experiences", "price_range")
    op.drop_column("experiences", "image_url")
    op.create_index("ix_experiences_location", "experiences", ["location"])

    # ── properties ─────────────────────────────────────────────────────────────
    op.add_column("properties", sa.Column("price_min", sa.Float(), nullable=True))
    op.add_column("properties", sa.Column("price_max", sa.Float(), nullable=True))
    op.add_column(
        "properties",
        sa.Column("images", postgresql.JSONB(), nullable=False, server_default="[]"),
    )
    op.add_column(
        "properties",
        sa.Column("listing_tier", sa.String(), nullable=False, server_default="standard"),
    )
    op.add_column("properties", sa.Column("owner_contact", sa.String(), nullable=True))
    op.add_column("properties", sa.Column("location", sa.String(), nullable=True))
    op.drop_column("properties", "price_range")
    op.drop_column("properties", "image_url")
    op.drop_column("properties", "contact_url")
    op.create_index("ix_properties_location", "properties", ["location"])

    # ── inquiries ──────────────────────────────────────────────────────────────
    op.create_table(
        "inquiries",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("source_type", sa.String(), nullable=False, server_default="general"),
        sa.Column("source_id", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index("ix_inquiries_source_type", "inquiries", ["source_type"])
    op.create_index("ix_inquiries_created_at", "inquiries", ["created_at"])


def downgrade() -> None:
    # ── inquiries ──────────────────────────────────────────────────────────────
    op.drop_index("ix_inquiries_created_at", table_name="inquiries")
    op.drop_index("ix_inquiries_source_type", table_name="inquiries")
    op.drop_table("inquiries")

    # ── properties ─────────────────────────────────────────────────────────────
    op.drop_index("ix_properties_location", table_name="properties")
    op.drop_column("properties", "location")
    op.drop_column("properties", "owner_contact")
    op.drop_column("properties", "listing_tier")
    op.drop_column("properties", "images")
    op.drop_column("properties", "price_max")
    op.drop_column("properties", "price_min")
    op.add_column("properties", sa.Column("contact_url", sa.String(), nullable=True))
    op.add_column("properties", sa.Column("image_url", sa.String(), nullable=True))
    op.add_column("properties", sa.Column("price_range", sa.String(), nullable=True))

    # ── experiences ────────────────────────────────────────────────────────────
    op.drop_index("ix_experiences_location", table_name="experiences")
    op.drop_column("experiences", "location")
    op.drop_column("experiences", "provider_contact")
    op.drop_column("experiences", "is_featured")
    op.drop_column("experiences", "images")
    op.drop_column("experiences", "price_max")
    op.drop_column("experiences", "price_min")
    op.add_column("experiences", sa.Column("image_url", sa.String(), nullable=True))
    op.add_column("experiences", sa.Column("price_range", sa.String(), nullable=True))
