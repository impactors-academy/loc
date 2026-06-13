"""EXP-4: full-text search on experiences (pg_trgm + tsvector GIN index)

Revision ID: 002exp4fts
Revises: 001infra4
Create Date: 2026-06-13

"""
from typing import Sequence, Union

from alembic import op

revision: str = "002exp4fts"
down_revision: Union[str, None] = "001infra4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pg_trgm for trigram similarity (typo tolerance)
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    # Add a generated tsvector column that indexes title + description + location
    op.execute("""
        ALTER TABLE experiences
        ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector('english',
                coalesce(title, '') || ' ' ||
                coalesce(description, '') || ' ' ||
                coalesce(location, '') || ' ' ||
                coalesce(category, '')
            )
        ) STORED
    """)

    # GIN index for fast full-text lookup
    op.create_index(
        "ix_experiences_search_vector",
        "experiences",
        ["search_vector"],
        postgresql_using="gin",
    )

    # Trigram index on title for partial/typo matching
    op.execute(
        "CREATE INDEX ix_experiences_title_trgm ON experiences USING gin (title gin_trgm_ops)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_experiences_title_trgm")
    op.drop_index("ix_experiences_search_vector", table_name="experiences")
    op.execute("ALTER TABLE experiences DROP COLUMN IF EXISTS search_vector")
