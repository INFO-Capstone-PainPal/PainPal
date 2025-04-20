"""create streak feature

Revision ID: 2a8919268241
Revises: 7082a4d512d1
Create Date: 2025-04-18 15:12:27.428238
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a8919268241'
down_revision: Union[str, None] = '7082a4d512d1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('streak', sa.Integer(), nullable=False, server_default=sa.text("0")))
    op.add_column('users', sa.Column('last_checkin_date', sa.Date(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'last_checkin_date')
    op.drop_column('users', 'streak')