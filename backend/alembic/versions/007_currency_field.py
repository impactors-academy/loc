"""Add currency field to experiences, properties, products

Revision ID: 007currency
Revises: 006exp5ref
Create Date: 2026-09-06

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "007currency"
down_revision: Union[str, None] = "006exp5ref"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    for table in ("experiences", "properties", "products"):
        op.add_column(
            table,
            sa.Column("currency", sa.String(), nullable=False, server_default="EUR"),
        )


def downgrade() -> None:
    for table in ("experiences", "properties", "products"):
        op.drop_column(table, "currency")
