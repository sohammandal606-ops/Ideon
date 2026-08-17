"""Shared FastAPI dependencies injected into route handlers.

Provides two things every authenticated route needs:
  - DatabaseSession: async DB session for the current request (from db.connection)
  - get_current_user: validates the Bearer token via Supabase Auth and returns
    the user's ID and email as a CurrentUser dict

Depends on: core.supabase_client (auth), db.connection (sessions)
Used by:    api.v1.routes.users, api.v1.routes.auth (indirectly), main.py
"""

import asyncio
from typing import Annotated, TypedDict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel.ext.asyncio.session import AsyncSession

from core.supabase_client import supabase_client
from db.connection import get_database_session
from services.user_service import UserService, get_user_service

# Extracts the "Bearer <token>" header from incoming requests automatically.
security = HTTPBearer(auto_error=True)

# Type aliases using Annotated + Depends: when a route parameter has one of
# these types, FastAPI automatically calls the dependency function and injects
# the result. No manual wiring needed.
BearerCredentials = Annotated[HTTPAuthorizationCredentials, Depends(security)]
DatabaseSession = Annotated[AsyncSession, Depends(get_database_session)]


class CurrentUser(TypedDict):
    """Minimal authenticated-user data required by API handlers."""

    sub: str
    email: str


async def get_current_user(
    credentials: BearerCredentials,
) -> CurrentUser:
    """Validate Bearer token with Supabase Auth and return authenticated user dict."""
    token = credentials.credentials
    try:
        # Supabase SDK is synchronous — to_thread runs it in a background
        # thread so it doesn't block the async event loop.
        auth_response = await asyncio.to_thread(supabase_client.auth.get_user, token)
        if not auth_response or not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {
            "sub": str(auth_response.user.id),
            "email": auth_response.user.email or "",
        }
    except HTTPException:
        raise
    except Exception:
        # "from None" hides the original traceback from the client — we
        # already logged it, so the user just sees a clean 401 error.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            headers={"WWW-Authenticate": "Bearer"},
        ) from None


async def get_current_db_user(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_database_session),
    user_service: UserService = Depends(get_user_service),
):
    """Return the internal database User for the authenticated user.

    Creates the profile automatically on first login.
    """
    return await user_service.get_or_create_profile(
        session, current_user["sub"], current_user["email"]
    )
