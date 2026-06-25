"""DISC-4: add duration field to experiences

Revision ID: 005disc4dur
Revises: 004global
Create Date: 2026-06-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005disc4dur"
down_revision: Union[str, None] = "004global"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("experiences", sa.Column("duration", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("experiences", "duration")
