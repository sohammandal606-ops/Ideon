"""Tests for the AI Consultant RAG chat route."""

import os
from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, patch
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

USER_ID = UUID("00000000-0000-0000-0000-000000000010")
STARTUP_ID = UUID("00000000-0000-0000-0000-000000000020")


class FakeUser:
    def __init__(self, user_id: UUID) -> None:
        self.id = user_id


class FakeStartup:
    def __init__(self, startup_id: UUID, user_id: UUID) -> None:
        self.id = startup_id
        self.user_id = user_id


async def fake_database_session() -> AsyncGenerator[None, None]:
    yield None


@pytest.fixture
def client():
    app.dependency_overrides[get_current_db_user] = lambda: FakeUser(USER_ID)
    app.dependency_overrides[get_database_session] = fake_database_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_chat_with_consultant(client: TestClient):
    fake_startup = FakeStartup(STARTUP_ID, USER_ID)

    mock_answer = {
        "reply": "Your defensibility score is low because of weak moats against incumbents.",
        "citations": [
            {
                "section": "competitor_analysis",
                "title": "Competitor Landscape & Moats",
                "preview": "Competitive Moat: None specified...",
            }
        ],
    }

    with (
        patch(
            "db.repositories.startup_repository.StartupRepository.get_by_id",
            new_callable=AsyncMock,
            return_value=fake_startup,
        ),
        patch(
            "services.consultant_service.AIConsultantService.answer_question",
            new_callable=AsyncMock,
            return_value=mock_answer,
        ),
    ):
        response = client.post(
            f"/api/v1/startups/{STARTUP_ID}/chat",
            json={
                "message": "Why is my defensibility score low and how do I fix it?",
                "history": [],
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert "defensibility score is low" in data["reply"]
    assert len(data["citations"]) == 1
    assert data["citations"][0]["section"] == "competitor_analysis"
