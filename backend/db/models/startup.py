"""Startup database model.

This is the core entity of IDEON. It represents a user's startup idea.
It uses pure SQLModel (no direct sqlalchemy imports) to keep things simple.

Depends on: None
Used by:    db.repositories.startup_repository
"""

from datetime import UTC, datetime
from typing import Optional
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
    problem: Optional[str] = Field(default=None)
    solution: Optional[str] = Field(default=None)
    target_market: Optional[str] = Field(default=None)
    
    # Extra fields added by your friend
    industry: Optional[str] = Field(default=None, max_length=100)
    stage: Optional[str] = Field(default=None, max_length=50)
    business_model: Optional[str] = Field(default=None, max_length=2000)
    unique_value_proposition: Optional[str] = Field(default=None, max_length=2000)
    competitors: Optional[str] = Field(default=None, max_length=3000)

    # Automatically set timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )
