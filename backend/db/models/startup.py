"""Startup database model.

This is the core entity of IDEON. It represents a user's startup idea.
It uses pure SQLModel (no direct sqlalchemy imports) to keep things simple.

Depends on: None
Used by:    db.repositories.startup_repository
"""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class Startup(SQLModel, table=True):
    """Database model for a Startup."""
    
    # We specify the table name explicitly to keep it plural
    __tablename__ = "startups"

    # Primary key, automatically generated using uuid4
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    
    # Foreign key linking this startup to the user who created it
    user_id: UUID = Field(foreign_key="users.id", index=True)

    # Core required fields
    name: str = Field(max_length=100)
    description: str

    # Optional fields that the user might not know yet
    industry: str | None = Field(default=None)
    target_market: str | None = Field(default=None)
    additional_info: str | None = Field(default=None)

    # Automatically set timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC).replace(tzinfo=None),
        nullable=False,
    )
