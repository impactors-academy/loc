"""Global expansion: add country field to experiences and properties

Revision ID: 004global
Revises: 003r3vector
Create Date: 2026-06-19

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004global"
down_revision: Union[str, None] = "003r3vector"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("experiences", sa.Column("country", sa.String(), nullable=True))
    op.create_index("ix_experiences_country", "experiences", ["country"])

    op.add_column("properties", sa.Column("country", sa.String(), nullable=True))
    op.create_index("ix_properties_country", "properties", ["country"])


def downgrade() -> None:
    op.drop_index("ix_properties_country", table_name="properties")
    op.drop_column("properties", "country")
    op.drop_index("ix_experiences_country", table_name="experiences")
    op.drop_column("experiences", "country")
