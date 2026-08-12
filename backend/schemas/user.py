"""Request/response shapes for user profile endpoints.

- UserResponse: serializes a SQLModel User object (from_attributes=True)
- UserUpdate:   validates PATCH /users/me body (only `name` is mutable)
- UserStats:    structures the aggregate stats response

Used by: api.v1.routes.users
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    auth_user_id: UUID
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=100)


class UserStats(BaseModel):
    total_startups: int = Field(default=0, ge=0)
    completed_analysis: int = Field(default=0, ge=0)
    reports_generated: int = Field(default=0, ge=0)
    pitch_decks_generated: int = Field(default=0, ge=0)
