"""Request/response shapes for the authentication endpoints.

Validates incoming signup/login payloads and structures the token response
sent back to the client. These models never touch the database directly.

Used by: api.v1.routes.auth
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SignupRequest(BaseModel):
    # extra="forbid" means if someone sends {"email": "...", "age": 25},
    # the request is rejected because "age" is not a defined field.
    model_config = ConfigDict(extra="forbid")

    email: EmailStr                              # must be a valid email format
    password: str = Field(min_length=8, max_length=128)  # at least 8 characters


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthUserResponse(BaseModel):
    """The authenticated user returned with a successful login."""

    id: str
    email: EmailStr
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: AuthUserResponse


class SignupResponse(BaseModel):
    message: str
