"""Pydantic schemas for the Startup entity.

These schemas are used for input validation (what the frontend sends)
and output serialization (what we send back to the frontend).
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StartupCreate(BaseModel):
    """Data required to create a new startup idea."""

    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=10)
    industry: str | None = None
    target_market: str | None = None
    additional_info: str | None = None


class StartupUpdate(BaseModel):
    """Data used to update an existing startup. All fields are optional."""

    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, min_length=10)
    industry: str | None = None
    target_market: str | None = None
    additional_info: str | None = None


class StartupResponse(BaseModel):
    """Data returned to the frontend when reading a startup."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    description: str
    industry: str | None
    target_market: str | None
    additional_info: str | None
    created_at: datetime
    updated_at: datetime
