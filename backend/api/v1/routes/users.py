"""Authenticated endpoints for user profiles and statistics.

Every request requires a valid Bearer token (via get_current_user) and
receives a database session (via DatabaseSession). Operations flow:

    Route → UserService → UserRepository → SQLModel → PostgreSQL

Depends on: api.v1.deps, services.user_service, schemas.user
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from api.v1.deps import CurrentUser, DatabaseSession, get_current_user
from schemas.user import UserResponse, UserStats, UserUpdate
from services.user_service import UserService, get_user_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/users", tags=["users"])
CurrentUserDependency = Annotated[CurrentUser, Depends(get_current_user)]
UserServiceDependency = Annotated[UserService, Depends(get_user_service)]


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: CurrentUserDependency,
    user_service: UserServiceDependency,
    session: DatabaseSession,
):
    """Return the current user's application profile, provisioning it if needed."""
    try:
        return await user_service.get_or_create_profile(
            session, current_user["sub"], current_user["email"]
        )
    except Exception:
        # logger.exception automatically includes the full error stack trace
        # in the server logs so we can debug what actually went wrong.
        logger.exception("Unable to retrieve profile for authenticated user")
        
        # We raise an HTTP error to tell the frontend something went wrong.
        # "from None" hides the original internal error stack trace from 
        # the client response, keeping our internals secure and clean.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User profile service is temporarily unavailable",
        ) from None


@router.patch("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    current_user: CurrentUserDependency,
    user_service: UserServiceDependency,
    session: DatabaseSession,
):
    """Update mutable application-profile fields for the current user."""
    if user_data.name is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update",
        )
    try:
        profile = await user_service.update_profile(
            session, current_user["sub"], user_data.name
        )
    except Exception:
        logger.exception("Unable to update profile for authenticated user")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User profile service is temporarily unavailable",
        ) from None
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )
    return profile


@router.get("/me/stats", response_model=UserStats)
async def get_current_user_stats(
    current_user: CurrentUserDependency,
    user_service: UserServiceDependency,
    session: DatabaseSession,
):
    """Return aggregate statistics for startups owned by the current user."""
    try:
        stats = await user_service.get_stats(session, current_user["sub"])
    except Exception:
        logger.exception("Unable to retrieve user statistics")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User statistics service is temporarily unavailable",
        ) from None
    if stats is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )
    return stats
