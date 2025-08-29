




"""Initial migration with users, documents, conversations, and messages tables

Revision ID: initial_migration
Revises:
Create Date: 2025-08-27 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'initial_migration'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('username', sa.String, unique=True, index=True, nullable=False),
        sa.Column('email', sa.String, unique=True, index=True, nullable=False),
        sa.Column('hashed_password', sa.String, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False)
    )

    # Create documents table
    op.create_table(
        'documents',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('title', sa.String, index=True, nullable=False),
        sa.Column('file_type', sa.String, nullable=False),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('document_metadata', sa.Text, nullable=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False)
    )

    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('document_id', sa.Integer, sa.ForeignKey('documents.id'), nullable=True),
        sa.Column('title', sa.String, index=True, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False)
    )

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('conversation_id', sa.Integer, sa.ForeignKey('conversations.id'), nullable=False),
        sa.Column('sender', sa.String, nullable=False),  # "user" or "ai"
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('message_metadata', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False)
    )

def downgrade():
    op.drop_table('messages')
    op.drop_table('conversations')
    op.drop_table('documents')
    op.drop_table('users')



