"""Tests for startup CRUD routes using fully mocked dependencies.

Overrides three FastAPI dependencies so tests run without Supabase or a
real database:
- get_current_db_user  → returns a fake User object
- get_startup_service  → returns FakeStartupService with in-memory storage
- get_database_session → yields None (FakeStartupService ignores it)
"""

import os
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from uuid import UUID

os.environ.setdefault(
    "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/ideon"
)
os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SECRET_KEY", "test-server-key")

import pytest
from fastapi.testclient import TestClient

from api.v1.deps import get_current_db_user
from db.connection import get_database_session
from main import app
from services.startup_service import StartupNotFoundError, get_startup_service

# ── Test constants ──────────────────────────────────────────────────────────

USER_ID = UUID("00000000-0000-0000-0000-000000000010")
STARTUP_ID = UUID("00000000-0000-0000-0000-000000000020")
MISSING_ID = UUID("00000000-0000-0000-0000-000000000099")
NOW = datetime(2026, 1, 1, tzinfo=UTC)

STARTUP_DATA = {
    "id": STARTUP_ID,
    "user_id": USER_ID,
    "name": "Acme AI",
    "description": "An AI-powered solution for small businesses",
    "problem": None,
    "solution": None,
    "target_market": None,
    "created_at": NOW,
    "updated_at": NOW,
}


# ── Fakes ───────────────────────────────────────────────────────────────────


class FakeUser:
    """Minimal stand-in for the SQLModel User returned by get_current_db_user."""

    def __init__(self, user_id: UUID) -> None:
        self.id = user_id


class FakeStartupService:
    """In-memory service that mimics real StartupService behavior."""

    def __init__(self) -> None:
        # Store startups keyed by id for easy lookup
        self._startups: dict[UUID, dict] = {STARTUP_ID: {**STARTUP_DATA}}

    async def create_startup(self, session, user_id, startup_in):
        data = startup_in.model_dump()
        startup = {
            "id": UUID("00000000-0000-0000-0000-000000000030"),
            "user_id": user_id,
            **data,
            "created_at": NOW,
            "updated_at": NOW,
        }
        self._startups[startup["id"]] = startup
        return startup

    async def get_all_startups(self, session, user_id):
        return [s for s in self._startups.values() if s["user_id"] == user_id]

    async def get_startup(self, session, startup_id, user_id):
        startup = self._startups.get(startup_id)
        if not startup or startup["user_id"] != user_id:
            raise StartupNotFoundError("Startup not found")
        return startup

    async def update_startup(self, session, startup_id, user_id, update_data):
        startup = await self.get_startup(session, startup_id, user_id)
        update_dict = update_data.model_dump(exclude_unset=True)
        startup.update(update_dict)
        startup["updated_at"] = NOW
        return startup

    async def delete_startup(self, session, startup_id, user_id):
        await self.get_startup(session, startup_id, user_id)
        del self._startups[startup_id]


async def fake_database_session() -> AsyncGenerator[None, None]:
    """Yield a placeholder session so route signatures are satisfied."""
    yield None


# ── Fixtures ────────────────────────────────────────────────────────────────


@pytest.fixture(autouse=True)
def clear_overrides():
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


def authenticate(user_id: UUID = USER_ID):
    """Wire up all dependency overrides for an authenticated user."""
    app.dependency_overrides[get_current_db_user] = lambda: FakeUser(user_id)
    app.dependency_overrides[get_startup_service] = FakeStartupService
    app.dependency_overrides[get_database_session] = fake_database_session


# ── Auth tests ──────────────────────────────────────────────────────────────


def test_list_startups_unauthorized(client):
    response = client.get("/api/v1/startups")

    assert response.status_code == 401


def test_create_startup_unauthorized(client):
    response = client.post(
        "/api/v1/startups",
        json={"name": "X", "description": "A long enough description"},
    )

    assert response.status_code == 401


# ── CREATE ──────────────────────────────────────────────────────────────────


def test_create_startup_success(client):
    authenticate()

    response = client.post(
        "/api/v1/startups",
        json={
            "name": "My Startup",
            "description": "A revolutionary platform for founders",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Startup"
    assert data["description"] == "A revolutionary platform for founders"
    assert data["user_id"] == str(USER_ID)


def test_create_startup_with_optional_fields(client):
    authenticate()

    response = client.post(
        "/api/v1/startups",
        json={
            "name": "My Startup",
            "description": "A revolutionary platform for founders",
            "problem": "Founders waste time on repetitive tasks",
            "solution": "AI automation",
            "target_market": "Early-stage founders",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["problem"] == "Founders waste time on repetitive tasks"
    assert data["solution"] == "AI automation"
    assert data["target_market"] == "Early-stage founders"


def test_create_startup_missing_name(client):
    authenticate()

    response = client.post(
        "/api/v1/startups",
        json={
            "description": "A long enough description for validation",
        },
    )

    assert response.status_code == 422


def test_create_startup_description_too_short(client):
    authenticate()

    response = client.post(
        "/api/v1/startups",
        json={
            "name": "X",
            "description": "short",
        },
    )

    assert response.status_code == 422


def test_create_startup_rejects_extra_fields(client):
    authenticate()

    response = client.post(
        "/api/v1/startups",
        json={
            "name": "My Startup",
            "description": "A long enough description for validation",
            "revenue": 1000000,
        },
    )

    assert response.status_code == 422


# ── LIST ────────────────────────────────────────────────────────────────────


def test_list_startups_returns_owned(client):
    authenticate()

    response = client.get("/api/v1/startups")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Acme AI"


# ── GET ─────────────────────────────────────────────────────────────────────


def test_get_startup_success(client):
    authenticate()

    response = client.get(f"/api/v1/startups/{STARTUP_ID}")

    assert response.status_code == 200
    assert response.json()["id"] == str(STARTUP_ID)
    assert response.json()["name"] == "Acme AI"


def test_get_startup_not_found(client):
    authenticate()

    response = client.get(f"/api/v1/startups/{MISSING_ID}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Startup not found"


# ── UPDATE ──────────────────────────────────────────────────────────────────


def test_update_startup_success(client):
    authenticate()

    response = client.patch(
        f"/api/v1/startups/{STARTUP_ID}",
        json={
            "name": "Acme AI v2",
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Acme AI v2"
    # Description should remain unchanged since we only updated the name
    assert (
        response.json()["description"] == "An AI-powered solution for small businesses"
    )


def test_update_startup_not_found(client):
    authenticate()

    response = client.patch(
        f"/api/v1/startups/{MISSING_ID}",
        json={
            "name": "Ghost",
        },
    )

    assert response.status_code == 404


def test_update_startup_rejects_extra_fields(client):
    authenticate()

    response = client.patch(
        f"/api/v1/startups/{STARTUP_ID}",
        json={
            "revenue": 5000,
        },
    )

    assert response.status_code == 422


# ── DELETE ──────────────────────────────────────────────────────────────────


def test_delete_startup_success(client):
    authenticate()

    response = client.delete(f"/api/v1/startups/{STARTUP_ID}")

    assert response.status_code == 204
    assert response.content == b""


def test_delete_startup_not_found(client):
    authenticate()

    response = client.delete(f"/api/v1/startups/{MISSING_ID}")

    assert response.status_code == 404
