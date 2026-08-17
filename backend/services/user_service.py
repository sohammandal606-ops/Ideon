"""Business logic layer sitting between API routes and the database repository.

Coordinates user profile operations: get-or-create on first login, name
updates, and stats retrieval. Receives the database session from routes
and passes it down to UserRepository for actual queries.

Depends on: db.repositories.user_repository, db.models.user
Used by:    api.v1.routes.users (injected as a FastAPI dependency)
"""

from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.user import User
from db.repositories.user_repository import UserRepository


class UserService:
    """Application logic for profiles owned by Supabase Auth users."""

    # The repository is passed in (injected) rather than created inside
    # this class. This makes it very easy to test because we can pass
    # a fake repository during testing.
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def get_or_create_profile(
        self, session: AsyncSession, auth_user_id: str, email: str
    ) -> User:
        # First, try to find an existing profile in the database
        profile = await self.repository.get_by_auth_user_id(session, auth_user_id)
        if profile is not None:
            return profile

        # If it doesn't exist, this is their first time logging in,
        # so we create a new profile for them automatically.
        return await self.repository.create_profile(session, auth_user_id, email)

    async def update_profile(
        self, session: AsyncSession, auth_user_id: str, name: str
    ) -> User | None:
        return await self.repository.update_name(session, auth_user_id, name)

    async def get_stats(
        self, session: AsyncSession, auth_user_id: str
    ) -> dict[str, int] | None:
        return await self.repository.get_stats(session, auth_user_id)


def get_user_service() -> UserService:
    return UserService(UserRepository())
