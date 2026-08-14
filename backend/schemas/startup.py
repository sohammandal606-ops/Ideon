"""Pydantic schemas for the Startup entity.

These schemas are used for input validation (what the frontend sends)
and output serialization (what we send back to the frontend).
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StartupCreate(BaseModel):
    """Data required to create a new startup idea."""
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=10)
    problem: Optional[str] = None
    solution: Optional[str] = None
    target_market: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=100)
    stage: Optional[str] = Field(default=None, max_length=50)
    business_model: Optional[str] = Field(default=None, max_length=2000)
    unique_value_proposition: Optional[str] = Field(default=None, max_length=2000)
    competitors: Optional[str] = Field(default=None, max_length=3000)


class StartupUpdate(BaseModel):
    """Data used to update an existing startup. All fields are optional."""
    model_config = ConfigDict(extra="forbid")

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    problem: Optional[str] = None
    solution: Optional[str] = None
    target_market: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=100)
    stage: Optional[str] = Field(default=None, max_length=50)
    business_model: Optional[str] = Field(default=None, max_length=2000)
    unique_value_proposition: Optional[str] = Field(default=None, max_length=2000)
    competitors: Optional[str] = Field(default=None, max_length=3000)


class StartupResponse(BaseModel):
    """Data returned to the frontend when reading a startup."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    description: str
    problem: Optional[str]
    solution: Optional[str]
    target_market: Optional[str]
    industry: Optional[str]
    stage: Optional[str]
    business_model: Optional[str]
    unique_value_proposition: Optional[str]
    competitors: Optional[str]
    created_at: datetime
    updated_at: datetime
