"""IDEON API entry point.

Creates the FastAPI app, registers route modules (auth, users), and exposes
health-check endpoints. The lifespan hook disposes the database engine on
shutdown.

Imported by: uvicorn (to serve the app)
Depends on: api.v1.routes (auth, users), api.v1.deps (DatabaseSession),
            db.connection (engine)
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import text

from api.v1.deps import DatabaseSession
from api.v1.routes import analysis_router, auth_router, startups_router, users_router
from db.connection import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Release shared infrastructure when the application stops."""
    # Anything before the 'yield' runs when the server starts up.
    # In this case, we don't need to do anything on startup.
    yield

    # Anything after the 'yield' runs when the server is shutting down.
    # Here, we close all database connections cleanly.
    await engine.dispose()


app = FastAPI(title="IDEON API", lifespan=lifespan)

# CORS (Cross-Origin Resource Sharing) middleware allows our frontend
# (running on localhost:3000) to securely make requests to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PATCH, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Connect our route files to the main app so FastAPI knows about them
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(startups_router)
app.include_router(analysis_router)


@app.get("/api/v1/health", tags=["health"])
async def health() -> dict[str, str]:
    """Return the API liveness status."""
    return {"status": "ok", "service": "ideon"}


@app.get("/api/v1/db-health", tags=["health"])
async def db_health(session: DatabaseSession) -> dict[str, bool | str]:
    """Verify database connectivity and pgvector availability."""
    await session.exec(text("SELECT 1"))

    result = await session.exec(
        text("SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector')")
    )
    pgvector_enabled = result.scalar()

    return {"status": "connected", "pgvector": pgvector_enabled}
