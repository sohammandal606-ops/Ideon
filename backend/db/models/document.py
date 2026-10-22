import uuid
from datetime import UTC, datetime
from typing import Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel


class DocumentChunk(SQLModel, table=True):
    """Database model for storing embedded chunks of startup analyses and documents."""

    __tablename__ = "document_chunks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
    )

    startup_id: uuid.UUID = Field(
        foreign_key="startups.id",
        index=True,
    )

    analysis_id: uuid.UUID | None = Field(
        default=None,
        foreign_key="analysis_runs.id",
        index=True,
    )

    section: str = Field(
        index=True,
        max_length=100,
        description="Section key, e.g. 'competitor_analysis', 'final_verdict', 'market_research'",
    )

    title: str = Field(
        default="",
        max_length=200,
        description="Human readable title for citations, e.g. 'Competitor Analysis & Moats'",
    )

    content: str = Field(
        description="The semantic text content for this chunk",
    )

    metadata_: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column("metadata", JSONB),
    )

    # 384 dimensions matching BAAI/bge-small-en-v1.5 from FastEmbed
    embedding: list[float] = Field(
        sa_column=Column(Vector(384)),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )
