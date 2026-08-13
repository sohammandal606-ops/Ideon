"""Tests for user profile routes using fully mocked dependencies.

Overrides three FastAPI dependencies so tests run without Supabase or a
real database:
  - get_current_user  → returns a hardcoded authenticated user
  - get_user_service  → returns FakeUserService with canned responses
  - get_database_session → yields None (FakeUserService ignores it)
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

from api.v1.deps import get_current_user
from db.connection import get_database_session
from main import app
from services.user_service import get_user_service

PROFILE = {
    "id": UUID("00000000-0000-0000-0000-000000000010"),
    "auth_user_id": UUID("00000000-0000-0000-0000-000000000001"),
    "name": "Test Founder",
    "email": "test@example.com",
    "created_at": datetime(2026, 1, 1, tzinfo=UTC),
    "updated_at": datetime(2026, 1, 1, tzinfo=UTC),
}


async def fake_database_session() -> AsyncGenerator[None, None]:
    """Yield a placeholder session so route signatures are satisfied."""
    yield None


class FakeUserService:
    async def get_or_create_profile(self, session, auth_user_id: str, email: str):
        assert auth_user_id == str(PROFILE["auth_user_id"])
        assert email == PROFILE["email"]
        return PROFILE

    async def update_profile(self, session, auth_user_id: str, name: str):
        assert auth_user_id == str(PROFILE["auth_user_id"])
        return {**PROFILE, "name": name}

    async def get_stats(self, session, auth_user_id: str):
        assert auth_user_id == str(PROFILE["auth_user_id"])
        return {
            "total_startups": 2,
            "completed_analysis": 1,
            "reports_generated": 1,
            "pitch_decks_generated": 0,
        }


# @pytest.fixture(autouse=True) means this function runs automatically
# before every single test. It clears any overrides so tests don't pollute each other.
@pytest.fixture(autouse=True)
def clear_overrides():
    yield
    app.dependency_overrides.clear()


# A fixture that creates a fake browser (TestClient) to make requests to our API.
@pytest.fixture
def client():
    return TestClient(app)


def authenticate_as_test_user():
    # We replace the real dependencies with our fakes using dependency_overrides.
    # When a route asks for get_current_user, FastAPI gives it this lambda instead.
    app.dependency_overrides[get_current_user] = lambda: {
        "sub": str(PROFILE["auth_user_id"]),
        "email": PROFILE["email"],
    }
    app.dependency_overrides[get_user_service] = lambda: FakeUserService()
    app.dependency_overrides[get_database_session] = fake_database_session


def test_health_endpoint(client):
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ideon"}


def test_user_me_unauthorized(client):
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401


def test_user_me_stats_unauthorized(client):
    response = client.get("/api/v1/users/me/stats")

    assert response.status_code == 401


def test_user_me_returns_authenticated_profile(client):
    authenticate_as_test_user()

    response = client.get("/api/v1/users/me")

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert response.json()["name"] == "Test Founder"


def test_user_me_updates_only_profile_name(client):
    authenticate_as_test_user()

    response = client.patch("/api/v1/users/me", json={"name": "Updated Founder"})

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Founder"


def test_user_me_rejects_email_updates(client):
    authenticate_as_test_user()

    response = client.patch("/api/v1/users/me", json={"email": "new@example.com"})

    assert response.status_code == 422


def test_user_stats_returns_owned_aggregate(client):
    authenticate_as_test_user()

    response = client.get("/api/v1/users/me/stats")

    assert response.status_code == 200
    assert response.json()["total_startups"] == 2
    assert response.json()["completed_analysis"] == 1
