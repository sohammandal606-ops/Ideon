"""Creates the async database engine and provides session injection.

All database access flows through get_database_session(), which yields one
AsyncSession per request. Routes receive it via the DatabaseSession type
alias defined in api.v1.deps, then pass it to services and repositories.

Note: SQLModel does not provide its own async engine or session factory,
so we import those two things from sqlalchemy. Everything else uses SQLModel.

Depends on: core.config (DATABASE_URL)
Used by:    api.v1.deps (DatabaseSession alias), main.py (engine disposal)
"""

from collections.abc import AsyncGenerator

# SQLModel doesn't have its own async engine — these two imports are required.
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession

from core.config import settings

# Connection pool: keeps a few database connections open and ready to use
# so we don't create a new connection for every single request.
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=4,  # keep 4 connections open at all times
    max_overflow=2,  # allow 2 extra connections during traffic spikes
    pool_timeout=30,  # wait up to 30s for a free connection
    pool_recycle=1800,  # replace connections older than 30 minutes
    pool_pre_ping=True,  # test each connection before using it
)

# Session factory: creates a new database session (like a transaction window)
# each time we call it. expire_on_commit=False means we can still read data
# from objects after committing without hitting the DB again.
session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_database_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session for the duration of a request."""
    async with session_factory() as session:
        yield session
