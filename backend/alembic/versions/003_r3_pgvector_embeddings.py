"""R3: enable pgvector, add embedding columns to experiences and blog_posts

Revision ID: 003r3vector
Revises: 002exp4fts
Create Date: 2026-06-13

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003r3vector"
down_revision: Union[str, None] = "002exp4fts"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.add_column("experiences", sa.Column("embedding", sa.Text(), nullable=True))
    op.execute(
        "ALTER TABLE experiences ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536)"
    )
    op.execute(
        "CREATE INDEX ix_experiences_embedding ON experiences "
        "USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)"
    )

    op.add_column("blog_posts", sa.Column("embedding", sa.Text(), nullable=True))
    op.execute(
        "ALTER TABLE blog_posts ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536)"
    )
    op.execute(
        "CREATE INDEX ix_blog_posts_embedding ON blog_posts "
        "USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_blog_posts_embedding")
    op.drop_column("blog_posts", "embedding")
    op.execute("DROP INDEX IF EXISTS ix_experiences_embedding")
    op.drop_column("experiences", "embedding")
