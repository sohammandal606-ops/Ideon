"""Database access logic for Startups.

This repository handles all direct database interactions for the Startup model,
keeping SQL queries out of our API routes and business logic.
"""

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.startup import Startup
from schemas.startup import StartupCreate, StartupUpdate


class StartupRepository:
    """Handles CRUD operations for Startups."""

    async def create(
        self,
        session: AsyncSession,
        user_id: UUID,
        startup_in: StartupCreate
    ) -> Startup:
        # Create a new Startup model from the validated Pydantic data
        startup = Startup(
            user_id=user_id,
            **startup_in.model_dump()
        )
        session.add(startup)
        await session.commit()
        await session.refresh(startup)
        return startup

    async def get_by_id(self,
                        session: AsyncSession,
                        startup_id: UUID) -> Startup | None:
        return await session.get(Startup, startup_id)

    async def get_all_for_user(self, 
                               session: AsyncSession,
                               user_id: UUID) -> list[Startup]:
        statement = select(Startup).where(Startup.user_id == user_id)
        result = await session.exec(statement)
        return list(result.all())

    async def update(
        self,
        session: AsyncSession,
        startup: Startup,
        update_data: StartupUpdate
    ) -> Startup:
        # Only update fields that were actually provided in the request
        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(startup, key, value)
            
        # Manually update the timestamp so we know it changed
        startup.updated_at = datetime.now(UTC)
        
        session.add(startup)
        await session.commit()
        await session.refresh(startup)
        return startup

    async def delete(self, session: AsyncSession, startup: Startup) -> None:
        await session.delete(startup)
        await session.commit()
