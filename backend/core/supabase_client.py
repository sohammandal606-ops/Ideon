"""Creates a single Supabase client used exclusively for authentication.

Data access goes through SQLModel (see db/connection.py), NOT this client.
Only the auth routes and the token-validation dependency use this.

Depends on: core.config (SUPABASE_URL, SUPABASE_SECRET_KEY)
Used by:    api.v1.deps (token validation), api.v1.routes.auth (signup, login)
"""

from supabase import Client, create_client

from core.config import settings

supabase_client: Client = create_client(
    str(settings.SUPABASE_URL), settings.SUPABASE_SECRET_KEY.get_secret_value()
)
