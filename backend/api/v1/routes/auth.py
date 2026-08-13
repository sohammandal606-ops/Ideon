"""Signup and login endpoints — delegates to Supabase Auth, not the DB.

These endpoints do NOT create an application profile. The profile is
auto-provisioned when the user first calls GET /api/v1/users/me
(see routes/users.py → UserService.get_or_create_profile).

Depends on: core.supabase_client, schemas.auth
"""

import asyncio
import logging

from fastapi import APIRouter, HTTPException, status

from core.supabase_client import supabase_client
from schemas.auth import (
    AuthUserResponse,
    LoginRequest,
    SignupRequest,
    SignupResponse,
    TokenResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(request: SignupRequest) -> SignupResponse:
    """Create a Supabase Auth user.

    The application profile is provisioned on the user's first authenticated request.
    """
    try:
        # The Supabase Python SDK is synchronous (it blocks).
        # We use asyncio.to_thread to run it in the background so it
        # doesn't freeze our async server while waiting for the network.
        response = await asyncio.to_thread(
            supabase_client.auth.sign_up,
            {
                "email": request.email,
                "password": request.password,
            },
        )
        # Supabase returns None for the user if the signup failed
        if response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signup failed",
            )
        return SignupResponse(
            message=(
                "User created successfully. Check your email for verification "
                "if enabled."
            )
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Supabase signup failed")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create user account",
        ) from None


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest) -> TokenResponse:
    """Authenticate a user and return a Supabase access token."""
    try:
        # Again, run the synchronous Supabase network call in a background thread
        response = await asyncio.to_thread(
            supabase_client.auth.sign_in_with_password,
            {
                "email": request.email,
                "password": request.password,
            },
        )
        return TokenResponse(
            access_token=response.session.access_token,
            token_type="bearer",
            user=AuthUserResponse(
                id=str(response.user.id),
                email=response.user.email or "",
                created_at=response.user.created_at,
            ),
        )
    except Exception:
        logger.exception("Supabase login failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from None
