"""Creates a ChatGroq instance using centralized settings.

Depends on: core.config (GROQ_API_KEY, GROQ_MODEL, GROQ_TEMPERATURE)
Used by:    agents, workflows (future)
"""

from langchain_groq import ChatGroq

from core.config import settings


def get_llm() -> ChatGroq:
    if settings.GROQ_API_KEY is None:
        raise ValueError("GROQ_API_KEY is not configured.")

    return ChatGroq(
        model=settings.GROQ_MODEL,
        temperature=settings.GROQ_TEMPERATURE,
        max_retries=3,
        api_key=settings.GROQ_API_KEY.get_secret_value(),
    )
