"""Creates a ChatMistralAI instance using centralized settings.

Depends on: core.config (MISTRAL_API_KEY, MISTRAL_MODEL, MISTRAL_TEMPERATURE)
Used by:    agents, workflows (future)
"""

from langchain_mistralai import ChatMistralAI

from core.config import settings


def get_llm() -> ChatMistralAI:
    if settings.MISTRAL_API_KEY is None:
        raise ValueError("MISTRAL_API_KEY is not configured.")

    return ChatMistralAI(
        model=settings.MISTRAL_MODEL,
        temperature=settings.MISTRAL_TEMPERATURE,
        max_retries=3,
        api_key=settings.MISTRAL_API_KEY.get_secret_value(),
    )
