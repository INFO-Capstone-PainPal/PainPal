"""Make pain_level and pain_map nullable

Revision ID: 12cbcb5d1f67
Revises: 76c38921ec81
Create Date: 2025-04-11 15:13:29.598969

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12cbcb5d1f67'
down_revision: Union[str, None] = '76c38921ec81'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('migraines', 'pain_level',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('migraines', 'pain_map',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('migraines', 'pain_map',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('migraines', 'pain_level',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###
