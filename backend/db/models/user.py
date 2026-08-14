"""SQLModel definition for the `users` PostgreSQL table.

Each row links a Supabase Auth identity (auth_user_id) to an application
profile with a display name and email.

Used by: db.repositories.user_repository (queries), services.user_service
"""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """Application-level user profile linked to a Supabase Auth identity."""

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    auth_user_id: UUID = Field(unique=True, index=True)
    name: str = Field(max_length=100)
    email: str = Field(max_length=255)
    plan: str = Field(default="free", max_length=50)
    
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )
