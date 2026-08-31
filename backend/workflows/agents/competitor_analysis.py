from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


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
    Analyzes the competitive landscape for the startup.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a competitive intelligence strategist. "
                "Your job is to identify competitors and define a competitive moat for a new startup.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Industry: {industry}\n"
                "Market Trends: {market_trends}\n\n"
                "Please provide a structured competitor analysis.",
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
        }
    )

    return {
        "current_agent": "Competitor Analysis",
        "progress_percentage": 40,
        "competitor_analysis": result.model_dump(),
    }
