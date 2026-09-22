"""Baseline: create the tables that predate Alembic.

Revision ID: 000baseline
Revises:
Create Date: 2026-08-05

Why this exists
---------------
`001infra4` was written as the first revision but it only ALTERs `experiences`
and `properties` — nothing in the chain ever created them. Those tables came from
`Base.metadata.create_all()` (see `app/db/init_db.py`), and Alembic was adopted
afterwards without a baseline. The result was that `alembic upgrade head` against
an empty database failed on the very first migration:

    (psycopg2.errors.UndefinedTable) relation "experiences" does not exist
    [SQL: ALTER TABLE experiences ADD COLUMN price_min FLOAT]

so `make up && make migrate` could never work for a fresh clone.

This revision reconstructs the pre-001 shape — the current models minus every
column added by 001-006, and with the three columns 001 drops (`price_range`,
`image_url`, `contact_url`) put back — so the existing chain replays cleanly on
an empty database.

Existing deployments are unaffected: they are already stamped at a later revision,
and Alembic only walks forward from wherever a database currently sits. Nothing
here re-runs against them.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "000baseline"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── experiences ────────────────────────────────────────────────────────────
    # price_range/image_url are dropped by 001; location, price_min, price_max,
    # images, is_featured and provider_contact are added by it. country (004),
    # duration (005), embedding (003) and search_vector (002) come later.
    op.create_table(
        "experiences",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("provider_name", sa.String(), nullable=True),
        sa.Column("referral_url", sa.String(), nullable=True),
        sa.Column("price_range", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_experiences_slug", "experiences", ["slug"], unique=True)
    op.create_index("ix_experiences_category", "experiences", ["category"])

    # ── properties ─────────────────────────────────────────────────────────────
    # price_range/image_url/contact_url are dropped by 001.
    op.create_table(
        "properties",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("price_range", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("contact_url", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_properties_slug", "properties", ["slug"], unique=True)
    op.create_index("ix_properties_type", "properties", ["type"])

    # ── blog_posts ─────────────────────────────────────────────────────────────
    # embedding is added by 003.
    op.create_table(
        "blog_posts",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("published_at", sa.DateTime(), nullable=True),
        sa.Column("tags", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_blog_posts_slug", "blog_posts", ["slug"], unique=True)

    # ── products ───────────────────────────────────────────────────────────────
    # Never touched by 001-006; this is its full and current shape.
    op.create_table(
        "products",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("purchase_url", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_products_slug", "products", ["slug"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_products_slug", table_name="products")
    op.drop_table("products")

    op.drop_index("ix_blog_posts_slug", table_name="blog_posts")
    op.drop_table("blog_posts")

    op.drop_index("ix_properties_type", table_name="properties")
    op.drop_index("ix_properties_slug", table_name="properties")
    op.drop_table("properties")

    op.drop_index("ix_experiences_category", table_name="experiences")
    op.drop_index("ix_experiences_slug", table_name="experiences")
    op.drop_table("experiences")
