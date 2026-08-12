"""Creates the async database engine and provides session injection.

All database access flows through get_database_session(), which yields one
AsyncSession per request. Routes receive it via the DatabaseSession type
alias defined in api.v1.deps, then pass it to services and repositories.

Depends on: core.config (DATABASE_URL)
Used by:    api.v1.deps (DatabaseSession alias), main.py (engine disposal)
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=4,
    max_overflow=2,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
)
# SQLModel uses SQLAlchemy's async engine internally. The application exposes
# SQLModel sessions so repositories and future models use the SQLModel API.
session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_database_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session for the duration of a request."""
    async with session_factory() as session:
        yield session
