from datetime import UTC, datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, SQLModel

from schemas.analysis import AnalysisStatus


class AnalysisRun(SQLModel, table=True):
    """Database model for a Startup AI analysis run."""

    __tablename__ = "analysis_runs"

    # Primary key
    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
    )

    # Startup relation
    startup_id: UUID = Field(
        foreign_key="startups.id",
        index=True,
    )

    # Analysis status
    status: AnalysisStatus = Field(
        default=AnalysisStatus.PENDING,
        index=True,
    )

    # Current agent
    current_agent: str | None = Field(
        default=None,
        max_length=100,
    )

    # Progress tracking
    progress_percentage: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    # Error tracking
    error_message: str | None = Field(
        default=None,
    )

    # LangGraph states

    inputs_snapshot: dict[str, Any] | None = Field(
        default=None,
        sa_column=Column(JSONB),
    )

    final_state_snapshot: dict[str, Any] | None = Field(
        default=None,
        sa_column=Column(JSONB),
    )

    # Timestamps
    started_at: datetime | None = Field(
        default=None,
    )

    completed_at: datetime | None = Field(
        default=None,
    )

    # System timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )
