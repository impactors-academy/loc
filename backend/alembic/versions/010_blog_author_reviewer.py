"""Add author and reviewer to blog posts

Revision ID: 010blogby
Revises: 009video
Create Date: 2026-09-27

Both hold a team member slug (the team list lives in the frontend, as it does
on impactors-academy), so they are plain strings rather than foreign keys.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "010blogby"
down_revision: Union[str, None] = "009video"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("blog_posts", sa.Column("author_slug", sa.String(), nullable=True))
    op.add_column("blog_posts", sa.Column("reviewer_slug", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("blog_posts", "reviewer_slug")
    op.drop_column("blog_posts", "author_slug")
