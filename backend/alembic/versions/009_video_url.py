"""Add video_url field to properties and products

Revision ID: 009video
Revises: 008amenit
Create Date: 2026-09-09

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "009video"
down_revision: Union[str, None] = "008amenit"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("properties", sa.Column("video_url", sa.String(), nullable=True))
    op.add_column("products", sa.Column("video_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "video_url")
    op.drop_column("properties", "video_url")
