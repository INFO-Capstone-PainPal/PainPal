"""Add weather field to CheckIn

Revision ID: 5d51b91132db
Revises: dcebbf513ec1
Create Date: 2025-05-16 11:07:46.643104

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5d51b91132db'
down_revision: Union[str, None] = 'dcebbf513ec1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('checkins', sa.Column('weather', sa.JSON(), nullable=True))

def downgrade() -> None:
    op.drop_column('checkins', 'weather')
