"""Database queries for user profiles — the only layer that touches the DB.

Receives an AsyncSession from the service layer, runs SQLModel queries,
and returns User model instances or dicts. No business logic lives here.

Depends on: db.models.user (User table)
Used by:    services.user_service (called by UserService)
"""

from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.user import User


class UserRepository:
    """Persistence operations for application-level user profiles."""

    async def get_by_auth_user_id(
        self, session: AsyncSession, auth_user_id: str
    ) -> User | None:
        statement = select(User).where(
            User.auth_user_id == UUID(auth_user_id)
        )
        result = await session.exec(statement)
        return result.first()

    async def create_profile(
        self, session: AsyncSession, auth_user_id: str, email: str
    ) -> User:
        name = email.split("@", maxsplit=1)[0] or "Founder"
        user = User(auth_user_id=UUID(auth_user_id), email=email, name=name)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    async def update_name(
        self, session: AsyncSession, auth_user_id: str, name: str
    ) -> User | None:
        user = await self.get_by_auth_user_id(session, auth_user_id)
        if user is None:
            return None
        user.name = name
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    async def get_stats(
        self, session: AsyncSession, auth_user_id: str
    ) -> dict[str, int] | None:
        user = await self.get_by_auth_user_id(session, auth_user_id)
        if user is None:
            return None
        # Startup, AnalysisRun, and Artifact models will be added in later
        # phases. Stats queries will be expanded once those tables exist.
        return {
            "total_startups": 0,
            "completed_analysis": 0,
            "reports_generated": 0,
            "pitch_decks_generated": 0,
        }
