
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ideon"
    SUPABASE_URL: str = "https://example.supabase.co"
    SUPABASE_SECRET_KEY: str = "example-key"

    # MISTRAL_API_KEY: str = ""
    # TAVILY_API_KEY: str = ""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()

