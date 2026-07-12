"""EXP-5: add referral_clicks table for commission attribution

Revision ID: 006exp5ref
Revises: 005disc4dur
Create Date: 2026-07-12

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "006exp5ref"
down_revision: Union[str, None] = "005disc4dur"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "referral_clicks",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("experience_slug", sa.String(), nullable=False),
        sa.Column("referral_url", sa.String(), nullable=False),
        sa.Column("clicked_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_referral_clicks_experience_slug", "referral_clicks", ["experience_slug"])


def downgrade() -> None:
    op.drop_index("ix_referral_clicks_experience_slug", table_name="referral_clicks")
    op.drop_table("referral_clicks")
