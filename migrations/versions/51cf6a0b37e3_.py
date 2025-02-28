"""empty message

Revision ID: 51cf6a0b37e3
Revises: 2290cce0872f
Create Date: 2024-11-19 16:49:56.894461

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '51cf6a0b37e3'
down_revision = '2290cce0872f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('news',
    sa.Column('id', sa.String(length=300), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('similar_news', postgresql.ARRAY(sa.String()), nullable=True),
    sa.Column('genre', postgresql.ARRAY(sa.String()), nullable=True),
    sa.Column('url', sa.String(), nullable=False),
    sa.Column('newspaper', sa.String(), nullable=False),
    sa.Column('published_at', sa.TIMESTAMP(), nullable=True),
    sa.Column('media_url', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.String(length=250), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(length=300), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('chats',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('user1_id', sa.String(length=250), nullable=True),
    sa.Column('user2_id', sa.String(length=250), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user1_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user2_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.String(length=250), nullable=True),
    sa.Column('news_id', sa.String(length=300), nullable=True),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['news_id'], ['news.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('friendships',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.String(length=250), nullable=True),
    sa.Column('friend_id', sa.String(length=250), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['friend_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('likes',
    sa.Column('user_id', sa.String(length=250), nullable=False),
    sa.Column('news_id', sa.String(length=300), nullable=False),
    sa.ForeignKeyConstraint(['news_id'], ['news.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'news_id')
    )
    op.create_table('profile',
    sa.Column('id', sa.String(length=250), nullable=False),
    sa.Column('user_id', sa.String(length=250), nullable=False),
    sa.Column('img_url', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('birthdate', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    op.create_table('saved_news',
    sa.Column('user_id', sa.String(length=250), nullable=False),
    sa.Column('news_id', sa.String(length=300), nullable=False),
    sa.ForeignKeyConstraint(['news_id'], ['news.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'news_id')
    )
    op.create_table('comment_replies',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('comment_id', sa.BigInteger(), nullable=True),
    sa.Column('user_id', sa.String(length=250), nullable=True),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['comment_id'], ['comments.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('messages',
    sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
    sa.Column('chat_id', sa.BigInteger(), nullable=True),
    sa.Column('sender_id', sa.String(length=250), nullable=True),
    sa.Column('receiver_id', sa.String(length=250), nullable=True),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.id'], ),
    sa.ForeignKeyConstraint(['receiver_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('messages')
    op.drop_table('comment_replies')
    op.drop_table('saved_news')
    op.drop_table('profile')
    op.drop_table('likes')
    op.drop_table('friendships')
    op.drop_table('comments')
    op.drop_table('chats')
    op.drop_table('user')
    op.drop_table('news')
    # ### end Alembic commands ###
