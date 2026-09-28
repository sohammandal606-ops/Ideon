"""Tests for starting startup analyses."""

import os
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from types import SimpleNamespace
from uuid import UUID

os.environ.setdefault(
    "DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost:5432/ideon"
)
os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SECRET_KEY", "test-server-key")

import pytest
from fastapi.testclient import TestClient

from api.v1.deps import get_current_db_user
from db.connection import get_database_session
from main import app
from schemas.analysis import AnalysisStatus
from services.analysis_service import get_analysis_service

USER_ID = UUID("00000000-0000-0000-0000-000000000010")
STARTUP_ID = UUID("00000000-0000-0000-0000-000000000020")
ANALYSIS_ID = UUID("00000000-0000-0000-0000-000000000030")
NOW = datetime(2026, 1, 1, tzinfo=UTC)


class FakeUser:
    def __init__(self, user_id: UUID) -> None:
        self.id = user_id


class FakeAnalysisService:
    def __init__(self) -> None:
        self.scheduled_analysis_ids: list[UUID] = []

    async def start_analysis(self, **_kwargs):
        return SimpleNamespace(
            id=ANALYSIS_ID,
            startup_id=STARTUP_ID,
            status=AnalysisStatus.PENDING,
            progress_percentage=0,
            created_at=NOW,
            updated_at=NOW,
        )

    async def run_analysis(self, analysis_id: UUID) -> None:
        self.scheduled_analysis_ids.append(analysis_id)


async def fake_database_session() -> AsyncGenerator[None, None]:
    yield None


@pytest.fixture
def client():
    service = FakeAnalysisService()
    app.dependency_overrides[get_current_db_user] = lambda: FakeUser(USER_ID)
    app.dependency_overrides[get_database_session] = fake_database_session
    app.dependency_overrides[get_analysis_service] = lambda: service
    try:
        yield TestClient(app), service
    finally:
        app.dependency_overrides.clear()


def test_start_analysis_returns_pending_and_schedules_workflow(client):
    test_client, service = client

    response = test_client.post(
        f"/api/v1/startups/{STARTUP_ID}/analysis",
        json={"force_re_run": False},
    )

    assert response.status_code == 202
    assert response.json()["status"] == "PENDING"
    assert service.scheduled_analysis_ids == [ANALYSIS_ID]
