"""API endpoints for Startup management.

These routes allow the frontend to create, read, update, and delete startups.
Everything is protected by the `get_current_db_user` dependency.
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from api.v1.deps import DatabaseSession, get_current_db_user
from db.models.user import User
from schemas.startup import StartupCreate, StartupResponse, StartupUpdate
from services.startup_service import (
    StartupNotFoundError,
    StartupService,
    get_startup_service,
)

router = APIRouter(prefix="/api/v1/startups", tags=["startups"])

# Create type aliases so we don't have to type this long thing everywhere
CurrentDBUser = Annotated[User, Depends(get_current_db_user)]
InjectedStartupService = Annotated[StartupService, Depends(get_startup_service)]


@router.post("", response_model=StartupResponse, status_code=status.HTTP_201_CREATED)
async def create_startup(
    startup_in: StartupCreate,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    service: InjectedStartupService,
):
    """Create a new startup idea for the currently logged-in user."""
    return await service.create_startup(session, db_user.id, startup_in)


@router.get("", response_model=list[StartupResponse])
async def list_startups(
    session: DatabaseSession,
    db_user: CurrentDBUser,
    service: InjectedStartupService,
):
    """List all startups owned by the currently logged-in user."""
    return await service.get_all_startups(session, db_user.id)


@router.get("/{startup_id}", response_model=StartupResponse)
async def get_startup(
    startup_id: UUID,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    service: InjectedStartupService,
):
    """Get a specific startup by its ID. (Will 404 if it belongs to someone else)."""
    try:
        return await service.get_startup(session, startup_id, db_user.id)
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        ) from None


@router.patch("/{startup_id}", response_model=StartupResponse)
async def update_startup(
    startup_id: UUID,
    startup_in: StartupUpdate,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    service: InjectedStartupService,
):
    """Update a specific startup."""
    try:
        return await service.update_startup(session, startup_id, db_user.id, startup_in)
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        ) from None


@router.delete("/{startup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(
    startup_id: UUID,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    service: InjectedStartupService,
):
    """Delete a specific startup."""
    try:
        await service.delete_startup(session, startup_id, db_user.id)
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        ) from None
