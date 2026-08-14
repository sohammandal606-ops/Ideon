"""API endpoints for Startup management.

These routes allow the frontend to create, read, update, and delete startups.
Everything is protected by the `get_current_user` dependency.
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from api.v1.deps import DatabaseSession, get_current_user
from db.repositories.startup_repository import StartupRepository
from schemas.startup import StartupCreate, StartupResponse, StartupUpdate
from services.startup_service import StartupService

router = APIRouter(prefix="/api/v1/startups", tags=["startups"])


def get_startup_service() -> StartupService:
    """Dependency injection for the StartupService."""
    repository = StartupRepository()
    return StartupService(repository)


# Create a type alias so we don't have to type this long thing everywhere
CurrentUser = Annotated[dict, Depends(get_current_user)]
InjectedStartupService = Annotated[StartupService, Depends(get_startup_service)]


@router.post("", response_model=StartupResponse, status_code=status.HTTP_201_CREATED)
async def create_startup(
    startup_in: StartupCreate,
    session: DatabaseSession,
    current_user: CurrentUser,
    service: InjectedStartupService,
):
    """Create a new startup idea for the currently logged-in user."""
    user_id = UUID(current_user["sub"])
    return await service.create_startup(session, user_id, startup_in)


@router.get("", response_model=list[StartupResponse])
async def list_startups(
    session: DatabaseSession,
    current_user: CurrentUser,
    service: InjectedStartupService,
):
    """List all startups owned by the currently logged-in user."""
    user_id = UUID(current_user["sub"])
    return await service.get_all_startups(session, user_id)


@router.get("/{startup_id}", response_model=StartupResponse)
async def get_startup(
    startup_id: UUID,
    session: DatabaseSession,
    current_user: CurrentUser,
    service: InjectedStartupService,
):
    """Get a specific startup by its ID. (Will 404 if it belongs to someone else)."""
    user_id = UUID(current_user["sub"])
    return await service.get_startup(session, startup_id, user_id)


@router.patch("/{startup_id}", response_model=StartupResponse)
async def update_startup(
    startup_id: UUID,
    startup_in: StartupUpdate,
    session: DatabaseSession,
    current_user: CurrentUser,
    service: InjectedStartupService,
):
    """Update a specific startup."""
    user_id = UUID(current_user["sub"])
    return await service.update_startup(session, startup_id, user_id, startup_in)


@router.delete("/{startup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(
    startup_id: UUID,
    session: DatabaseSession,
    current_user: CurrentUser,
    service: InjectedStartupService,
):
    """Delete a specific startup."""
    user_id = UUID(current_user["sub"])
    await service.delete_startup(session, startup_id, user_id)
