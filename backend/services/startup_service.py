"""Business logic for Startup management.

This service acts as a bridge between the API routes and the database repository.
It ensures that users can only access and modify their own startups.
"""

from uuid import UUID

from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.startup import Startup
from db.repositories.startup_repository import StartupRepository
from schemas.startup import StartupCreate, StartupUpdate


class StartupNotFoundError(Exception):
    """Raised when a startup doesn't exist or doesn't belong to the user."""


class StartupService:
    """Application logic for startup ideas."""

    def __init__(self, repository: StartupRepository) -> None:
        self.repository = repository

    async def create_startup(
        self, session: AsyncSession, user_id: UUID, startup_in: StartupCreate
    ) -> Startup:
        data = startup_in.model_dump()
        return await self.repository.create(session, user_id, data)

    async def get_all_startups(
        self, session: AsyncSession, user_id: UUID
    ) -> list[Startup]:
        return await self.repository.get_all_for_user(session, user_id)

    async def get_startup(
        self, session: AsyncSession, startup_id: UUID, user_id: UUID
    ) -> Startup:
        startup = await self.repository.get_by_id(session, startup_id)

        # Security check: Does the startup exist? Does it belong to this user?
        if not startup or startup.user_id != user_id:
            raise StartupNotFoundError("Startup not found")
        return startup

    async def update_startup(
        self,
        session: AsyncSession,
        startup_id: UUID,
        user_id: UUID,
        update_data: StartupUpdate,
    ) -> Startup:
        # First, retrieve it (this also does our security check!)
        startup = await self.get_startup(session, startup_id, user_id)

        # Then, update it
        update_dict = update_data.model_dump(exclude_unset=True)
        return await self.repository.update(session, startup, update_dict)

    async def delete_startup(
        self, session: AsyncSession, startup_id: UUID, user_id: UUID
    ) -> None:
        # First, retrieve it (this also does our security check!)
        startup = await self.get_startup(session, startup_id, user_id)

        # Then, delete it
        await self.repository.delete(session, startup)


def get_startup_service() -> StartupService:
    return StartupService(StartupRepository())

