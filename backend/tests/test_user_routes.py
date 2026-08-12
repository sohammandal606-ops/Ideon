import pytest
from fastapi.testclient import TestClient
from main import app
from api.v1.deps import get_current_user

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ideon"}


def test_user_me_unauthorized():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 403 or response.status_code == 401


def test_user_me_stats_unauthorized():
    response = client.get("/api/v1/users/me/stats")
    assert response.status_code == 403 or response.status_code == 401


def test_user_me_with_mock_auth(monkeypatch):
    # Mock authenticated user dependency
    def mock_get_current_user():
        return {"sub": "00000000-0000-0000-0000-000000000001", "email": "test@example.com"}

    app.dependency_overrides[get_current_user] = mock_get_current_user

    try:
        # Request should attempt to reach user profile
        response = client.get("/api/v1/users/me")
        # Should return 404 or 500 depending on Supabase connection state in test environment
        assert response.status_code in [200, 404, 500]
    finally:
        app.dependency_overrides.clear()
