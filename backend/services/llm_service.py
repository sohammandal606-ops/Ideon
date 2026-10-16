"""Creates ChatGroq instances using centralized settings.

Depends on: core.config (GROQ_API_KEY, GROQ_MODEL, GROQ_TEMPERATURE)
Used by:    agents, workflows

Note: Groq free-tier has a 1,000 OTPM limit per model.
max_tokens is capped at 900 to stay under that limit.
"""

from langchain_groq import ChatGroq

from core.config import settings


def get_llm(
    model: str | None = None,
    temperature: float | None = None,
    api_key: str | None = None,
) -> ChatGroq:
    resolved_key = (
        api_key
        or (settings.GROQ_API_KEY.get_secret_value() if settings.GROQ_API_KEY else None)
        or (settings.MISTRAL_API_KEY.get_secret_value() if settings.MISTRAL_API_KEY else None)
    )
    if not resolved_key:
        raise ValueError("GROQ_API_KEY is not configured in environment variables.")

    resolved_model = model or settings.GROQ_MODEL or "qwen/qwen3.8-27b"
    resolved_temp = (
        temperature
        if temperature is not None
        else (settings.GROQ_TEMPERATURE if settings.GROQ_TEMPERATURE is not None else 0.2)
    )

    return ChatGroq(
        model=resolved_model,
        temperature=resolved_temp,
        max_tokens=900,  # Stay under Groq free-tier 1000 OTPM limit
        max_retries=3,
        api_key=resolved_key,
    )


def get_agent_llm(agent_name: str) -> ChatGroq:
    """
    Get an initialized ChatGroq instance for a specific agent.
    Checks per-agent env vars first, then falls back to global settings.
    """
    agent_key = agent_name.upper().replace(" ", "_").replace("-", "_")

    key_attr = getattr(settings, f"GROQ_API_KEY_{agent_key}", None) or getattr(
        settings, f"MISTRAL_API_KEY_{agent_key}", None
    )
    api_key = key_attr.get_secret_value() if key_attr else None

    model = getattr(settings, f"GROQ_MODEL_{agent_key}", None) or getattr(
        settings, f"MISTRAL_MODEL_{agent_key}", None
    )
    temp = getattr(settings, f"GROQ_TEMPERATURE_{agent_key}", None) or getattr(
        settings, f"MISTRAL_TEMPERATURE_{agent_key}", None
    )

    return get_llm(model=model, temperature=temp, api_key=api_key)
