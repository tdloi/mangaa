"""add manga favorited

Revision ID: 0c5f9b953a78
Revises: 58d4f8b9a119
Create Date: 2019-04-28 13:09:41.435071

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c5f9b953a78'
down_revision = '58d4f8b9a119'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('images_id_chapter_fkey', 'images', type_='foreignkey')
    op.drop_constraint('images_id_manga_fkey', 'images', type_='foreignkey')
    op.create_foreign_key(None, 'images', 'chapter', ['id_chapter'], ['id'], ondelete='CASCADE')
    op.create_foreign_key(None, 'images', 'manga', ['id_manga'], ['id'], ondelete='CASCADE')
    op.add_column('users_manga', sa.Column('favorited', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users_manga', 'favorited')
    op.drop_constraint(None, 'images', type_='foreignkey')
    op.drop_constraint(None, 'images', type_='foreignkey')
    op.create_foreign_key('images_id_manga_fkey', 'images', 'manga', ['id_manga'], ['id'])
    op.create_foreign_key('images_id_chapter_fkey', 'images', 'chapter', ['id_chapter'], ['id'])
    # ### end Alembic commands ###
