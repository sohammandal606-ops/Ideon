"""DEPRECATED: LLM service is no longer used.

Each agent in workflows/agents/ now directly instantiates its own ChatMistralAI
model using its own dedicated API key (e.g. MISTRAL_API_KEY_<AGENT_NAME>)
configured in core.config.settings and .env.
"""
