from langchain.agents import create_agent
from langchain_tavily import TavilySearch

from core.config import settings
from services.llm_service import get_agent_llm


async def run_research_agent(research_prompt: str) -> str:
    """
    Spins up a ReAct agent equipped with Tavily to perform live web research.
    Returns the final synthesized research notes.
    """
    llm = get_agent_llm("RESEARCH")

    tavily_key = (
        settings.TAVILY_API_KEY.get_secret_value()
        if settings.TAVILY_API_KEY
        else None
    )
    if tavily_key:
        search = TavilySearch(max_results=3, api_key=tavily_key)
    else:
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
