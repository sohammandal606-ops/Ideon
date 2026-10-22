"""add_document_chunks_table

Revision ID: f02f291e7f88
Revises: 707e76dba275
Create Date: 2026-10-22 08:28:10.053477

"""
from typing import Sequence, Union

from alembic import op
import pgvector.sqlalchemy.vector
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f02f291e7f88'
down_revision: Union[str, Sequence[str], None] = '707e76dba275'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('document_chunks',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('startup_id', sa.Uuid(), nullable=False),
        sa.Column('analysis_id', sa.Uuid(), nullable=True),
        sa.Column('section', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False),
        sa.Column('content', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(dim=384), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['analysis_id'], ['analysis_runs.id'], ),
        sa.ForeignKeyConstraint(['startup_id'], ['startups.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_chunks_analysis_id'), 'document_chunks', ['analysis_id'], unique=False)
    op.create_index(op.f('ix_document_chunks_section'), 'document_chunks', ['section'], unique=False)
    op.create_index(op.f('ix_document_chunks_startup_id'), 'document_chunks', ['startup_id'], unique=False)
    
    # HNSW index for cosine similarity search
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_document_chunks_embedding_hnsw "
        "ON document_chunks USING hnsw (embedding vector_cosine_ops);"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP INDEX IF EXISTS ix_document_chunks_embedding_hnsw;")
    op.drop_index(op.f('ix_document_chunks_startup_id'), table_name='document_chunks')
    op.drop_index(op.f('ix_document_chunks_section'), table_name='document_chunks')
    op.drop_index(op.f('ix_document_chunks_analysis_id'), table_name='document_chunks')
    op.drop_table('document_chunks')
