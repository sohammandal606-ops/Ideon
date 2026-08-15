"""Loads environment variables into a typed Settings object.

Every module that needs DATABASE_URL, SUPABASE_URL, or SUPABASE_SECRET_KEY
imports the singleton `settings` from here. Values are read from the .env
file at startup.

Used by: db.connection (DATABASE_URL), core.supabase_client (Supabase keys)
"""

from pydantic import AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str
    SUPABASE_URL: AnyHttpUrl
    SUPABASE_SECRET_KEY: SecretStr

    # LLM settings (optional until agents/workflows are active)
    MISTRAL_API_KEY: SecretStr | None = None
    MISTRAL_MODEL: str = "mistral-large-latest"
    MISTRAL_TEMPERATURE: float = 0.2

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
