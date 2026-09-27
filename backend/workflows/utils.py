from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_tavily import TavilySearch

from core.config import settings


async def run_research_agent(research_prompt: str) -> str:
    """
    Spins up a ReAct agent equipped with Tavily to perform live web research.
    Returns the final synthesized research notes.
    """
    api_key = (
        settings.MISTRAL_API_KEY_RESEARCH.get_secret_value()
        if settings.MISTRAL_API_KEY_RESEARCH
        else (
            settings.MISTRAL_API_KEY.get_secret_value()
            if settings.MISTRAL_API_KEY
            else None
        )
    )
    if not api_key:
        raise ValueError(
            "MISTRAL_API_KEY_RESEARCH (or MISTRAL_API_KEY) is not configured."
        )

    llm = ChatMistralAI(
        model=settings.MISTRAL_MODEL_RESEARCH or settings.MISTRAL_MODEL,
        temperature=settings.MISTRAL_TEMPERATURE_RESEARCH
        if settings.MISTRAL_TEMPERATURE_RESEARCH is not None
        else settings.MISTRAL_TEMPERATURE,
        max_retries=3,
        api_key=api_key,
    )
    search = TavilySearch(max_results=3)
    tools = [search]

    system_message = (
        "You are an expert venture capital researcher. "
        "Use the tavily_search_results_json tool to find accurate, up-to-date information. "
        "Synthesize your findings into a detailed summary."
    )

    agent = create_agent(model=llm, tools=tools, system_prompt=system_message)

    response = await agent.ainvoke(
        {"messages": [{"role": "user", "content": research_prompt}]}
    )

    return response["messages"][-1].content
