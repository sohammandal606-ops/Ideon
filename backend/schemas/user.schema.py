from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from uuid import UUID


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    auth_user_id: UUID
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )
    email: EmailStr | None = None


class UserStats(BaseModel):
    total_startups: int = Field(default=0, ge=0)
    completed_analysis: int = Field(default=0, ge=0)
    reports_generated: int = Field(default=0, ge=0)
    pitch_decks_generated: int = Field(default=0, ge=0)