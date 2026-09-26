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

    # Default / fallback LLM settings
    MISTRAL_API_KEY: SecretStr | None = None
    MISTRAL_MODEL: str = "mistral-small-latest"
    MISTRAL_TEMPERATURE: float = 0.2

    # Per-Agent Mistral settings (Each agent can use its own API key & model)
    MISTRAL_API_KEY_IDEA_VALIDATOR: SecretStr | None = None
    MISTRAL_MODEL_IDEA_VALIDATOR: str | None = None
    MISTRAL_TEMPERATURE_IDEA_VALIDATOR: float | None = None

    MISTRAL_API_KEY_MARKET_RESEARCH: SecretStr | None = None
    MISTRAL_MODEL_MARKET_RESEARCH: str | None = None
    MISTRAL_TEMPERATURE_MARKET_RESEARCH: float | None = None

    MISTRAL_API_KEY_COMPETITOR_ANALYSIS: SecretStr | None = None
    MISTRAL_MODEL_COMPETITOR_ANALYSIS: str | None = None
    MISTRAL_TEMPERATURE_COMPETITOR_ANALYSIS: float | None = None

    MISTRAL_API_KEY_BUSINESS_MODEL: SecretStr | None = None
    MISTRAL_MODEL_BUSINESS_MODEL: str | None = None
    MISTRAL_TEMPERATURE_BUSINESS_MODEL: float | None = None

    MISTRAL_API_KEY_FINANCIAL_ANALYSIS: SecretStr | None = None
    MISTRAL_MODEL_FINANCIAL_ANALYSIS: str | None = None
    MISTRAL_TEMPERATURE_FINANCIAL_ANALYSIS: float | None = None

    MISTRAL_API_KEY_MVP_PLAN: SecretStr | None = None
    MISTRAL_MODEL_MVP_PLAN: str | None = None
    MISTRAL_TEMPERATURE_MVP_PLAN: float | None = None

    MISTRAL_API_KEY_GTM_STRATEGY: SecretStr | None = None
    MISTRAL_MODEL_GTM_STRATEGY: str | None = None
    MISTRAL_TEMPERATURE_GTM_STRATEGY: float | None = None

    MISTRAL_API_KEY_FINAL_VERDICT: SecretStr | None = None
    MISTRAL_MODEL_FINAL_VERDICT: str | None = None
    MISTRAL_TEMPERATURE_FINAL_VERDICT: float | None = None

    MISTRAL_API_KEY_RESEARCH: SecretStr | None = None
    MISTRAL_MODEL_RESEARCH: str | None = None
    MISTRAL_TEMPERATURE_RESEARCH: float | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
