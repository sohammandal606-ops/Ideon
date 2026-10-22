"""IDEON API entry point.

Creates the FastAPI app, registers route modules (auth, users), and exposes
health-check endpoints. The lifespan hook disposes the database engine on
shutdown.

Imported by: uvicorn (to serve the app)
Depends on: api.v1.routes (auth, users), api.v1.deps (DatabaseSession),
            db.connection (engine)
"""

from contextlib import asynccontextmanager

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import text

from api.v1.deps import DatabaseSession
from api.v1.routes import (
    analysis_router,
    auth_router,
    chat_router,
    startups_router,
    users_router,
)
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


logger = logging.getLogger(__name__)

app = FastAPI(title="IDEON API", lifespan=lifespan)

# CORS (Cross-Origin Resource Sharing) middleware allows our frontend
# (running on localhost:3000 or Vercel) to securely make requests to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ideon-ecru.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PATCH, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.middleware("http")
async def ensure_cors_on_all_responses(request: Request, call_next):
    """Guarantee CORS headers are present even when exceptions or 500s occur."""
    origin = request.headers.get("origin")
    try:
        response = await call_next(request)
    except Exception as exc:
        logger.exception("Unhandled error processing %s %s: %s", request.method, request.url.path, exc)
        response = JSONResponse(
            status_code=500,
            content={"detail": f"Database/Server error: {str(exc)}"},
        )
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error processing %s %s: %s", request.method, request.url.path, exc)
    origin = request.headers.get("origin", "https://ideon-ecru.vercel.app")
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }
    return JSONResponse(
        status_code=500,
        content={"detail": f"Database/Server error: {str(exc)}"},
        headers=headers,
    )

# Connect our route files to the main app so FastAPI knows about them
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(startups_router)
app.include_router(analysis_router)
app.include_router(chat_router)


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
