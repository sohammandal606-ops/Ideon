from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState
from workflows.utils import run_research_agent


class MarketResearchOutput(BaseModel):
    target_audience: list[str] = Field(
        description="Specific target audience segments for the product."
    )
    market_size: str = Field(
        description="Estimates of TAM (Total Addressable Market), SAM, and SOM."
    )
    key_trends: list[str] = Field(
        description="Current market trends supporting this startup idea."
    )
    opportunities: list[str] = Field(
        description="Key opportunities for growth and penetration."
    )


async def market_research_node(state: StartupState) -> dict:
    """
    Conducts market research for the startup idea using live web data.
    """
    llm = get_llm()
    
    # 1. Live Web Research Phase
    research_prompt = (
        f"Find recent data on the target audience and market size (TAM/SAM/SOM) "
        f"for a startup named {state.get('startup_name')} in the {state.get('industry')} industry. "
        f"Description: {state.get('description')}. Target market: {state.get('target_market')}. "
        f"Also find 2-3 current key trends in this specific market."
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
                "You are an expert market research analyst for venture capital. "
                "Analyze the target audience and market size for a new startup using the provided research notes.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Industry: {industry}\n"
                "Target Market: {target_market}\n\n"
                "Idea Validation Feedback: {idea_feedback}\n\n"
                "Live Web Research Notes:\n{research_notes}\n\n"
                "Please provide structured market research including audience, size, and trends based heavily on the Live Web Research Notes.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(MarketResearchOutput)

    idea_feedback = "None"
    if state.get("idea_validation"):
        idea_feedback = state["idea_validation"].get("feedback", "None")

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "industry": state.get("industry") or "Not specified",
            "target_market": state.get("target_market") or "Not specified",
            "idea_feedback": idea_feedback,
            "research_notes": research_notes,
        }
    )

    return {
        "current_agent": "Market Research",
        "progress_percentage": 30,
        "market_research": result.model_dump(),
    }
