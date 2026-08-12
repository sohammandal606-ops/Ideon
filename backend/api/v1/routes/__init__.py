"""Route modules that expose versioned IDEON API endpoints."""

from api.v1.deps import get_current_user

__all__ = ["get_current_user"]
