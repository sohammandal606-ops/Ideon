"""Database queries for user profiles — the only layer that touches the DB.

Receives an AsyncSession from the service layer, runs SQLModel queries,
and returns User model instances or dicts. No business logic lives here.

Depends on: db.models.user (User table)
Used by:    services.user_service (called by UserService)
"""

from datetime import UTC, datetime
from uuid import UUID

from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.startup import Startup
from db.models.user import User


class UserRepository:
    """Persistence operations for application-level user profiles."""

    async def get_by_auth_user_id(
        self, session: AsyncSession, auth_user_id: str
    ) -> User | None:
        # Build a SQL query: SELECT * FROM users WHERE auth_user_id = '...'
        statement = select(User).where(
            User.auth_user_id == UUID(auth_user_id)
        )
        result = await session.exec(statement)
        return result.first()  # returns the User or None if not found

    async def create_profile(
        self, session: AsyncSession, auth_user_id: str, email: str
    ) -> User:
        name = email.split("@", maxsplit=1)[0] or "Founder"
        user = User(auth_user_id=UUID(auth_user_id), email=email, name=name)
        session.add(user)           # stage the new row for insertion
        await session.commit()      # write it to the database
        await session.refresh(user) # reload to get DB-generated fields (id, timestamps)
        return user

    async def update_name(
        self, session: AsyncSession, auth_user_id: str, name: str
    ) -> User | None:
        user = await self.get_by_auth_user_id(session, auth_user_id)
        if user is None:
            return None
        user.name = name
        user.updated_at = datetime.now(UTC).replace(tzinfo=None)
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
            
        statement = (
            select(func.count())
            .select_from(Startup)
            .where(Startup.user_id == user.id)
        )
        result = await session.exec(statement)
        total_startups = result.first() or 0
        
        # AnalysisRun and Artifact models will be added in later
        # phases. Stats queries will be expanded once those tables exist.
        return {
            "total_startups": total_startups,
            "completed_analysis": 0,
            "reports_generated": 0,
            "pitch_decks_generated": 0,
        }
