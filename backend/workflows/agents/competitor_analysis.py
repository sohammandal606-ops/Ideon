from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState
from workflows.utils import run_research_agent


class CompetitorAnalysisOutput(BaseModel):
    direct_competitors: list[str] = Field(
        description="List of main direct competitors and their core offerings."
    )
    indirect_competitors: list[str] = Field(
        description="List of indirect competitors or alternative solutions."
    )
    competitive_advantage: str = Field(
        description="The unique value proposition or moat this startup has."
    )
    barriers_to_entry: list[str] = Field(
        description="Challenges competitors will face entering this specific space."
    )


async def competitor_analysis_node(state: StartupState) -> dict:
    """
    Analyzes the competitive landscape for the startup using live web data.
    """
    llm = get_llm()
    
    # 1. Live Web Research Phase
    research_prompt = (
        f"Find the top 3 direct competitors and 2 indirect competitors for a startup named {state.get('startup_name')} "
        f"in the {state.get('industry')} industry. Description: {state.get('description')}. "
        f"What are their core offerings and weaknesses?"
    )
    
    try:
        research_notes = await run_research_agent(research_prompt)
    except Exception as e:
        research_notes = f"Failed to search web: {e}"

    # 2. Data Extraction Phase
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a competitive intelligence strategist. "
                "Your job is to identify competitors and define a competitive moat for a new startup using the provided research notes.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Industry: {industry}\n"
                "Market Trends: {market_trends}\n\n"
                "Live Web Research Notes:\n{research_notes}\n\n"
                "Please provide a structured competitor analysis based on the Live Web Research.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(CompetitorAnalysisOutput)

    market_trends = "None"
    if state.get("market_research"):
        trends = state["market_research"].get("key_trends", [])
        market_trends = ", ".join(trends) if trends else "None"

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "industry": state.get("industry") or "Not specified",
            "market_trends": market_trends,
            "research_notes": research_notes,
        }
    )

    return {
        "current_agent": "Competitor Analysis",
        "progress_percentage": 40,
        "competitor_analysis": result.model_dump(),
    }
