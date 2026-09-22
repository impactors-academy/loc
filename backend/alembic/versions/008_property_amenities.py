"""Add amenities field to properties

Revision ID: 008amenit
Revises: 007currency
Create Date: 2026-09-08

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "008amenit"
down_revision: Union[str, None] = "007currency"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "properties",
        sa.Column("amenities", JSONB, nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_column("properties", "amenities")
