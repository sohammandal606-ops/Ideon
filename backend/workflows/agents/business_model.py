from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState
from workflows.utils import run_research_agent


class BusinessModelOutput(BaseModel):
    revenue_streams: list[str] = Field(
        description="How the startup will make money (e.g., subscriptions, ads)."
    )
    pricing_strategy: str = Field(
        description="The suggested pricing model (e.g., Freemium, Tiered SaaS)."
    )
    cost_structure: list[str] = Field(
        description="Main cost drivers (e.g., hosting, marketing, payroll)."
    )
    key_partners: list[str] = Field(
        description="Strategic partnerships required for success."
    )


async def business_model_node(state: StartupState) -> dict:
    """
    Generates a business model for the startup with enriched context and web search.
    """
    llm = get_llm()
    
    # 1. Live Web Research Phase
    research_prompt = (
        f"What are the standard pricing models and cost structures for startups in the {state.get('industry')} space? "
        f"Looking for industry benchmarks for {state.get('description')}."
    )
    
    try:
        research_notes = await run_research_agent(research_prompt)
    except Exception as e:
        research_notes = f"Failed to search web: {e}"

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a seasoned entrepreneur and business strategist. "
                "Design a viable and scalable business model for this startup using all provided context. "
                "CRITICAL: You must explicitly output a valid JSON containing ALL four fields: revenue_streams, pricing_strategy, cost_structure, and key_partners.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Target Audience: {target_audience}\n"
                "Competitive Advantage: {competitive_advantage}\n\n"
                "Live Web Industry Benchmarks:\n{research_notes}\n\n"
                "Please design a structured business model including revenue streams, pricing, and costs.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(BusinessModelOutput)

    target_audience = "None"
    if state.get("market_research"):
        audience = state["market_research"].get("target_audience", [])
        target_audience = ", ".join(audience) if audience else "None"

    competitive_advantage = "None"
    if state.get("competitor_analysis"):
        competitive_advantage = state["competitor_analysis"].get("competitive_advantage", "None")

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "target_audience": target_audience,
            "competitive_advantage": competitive_advantage,
            "research_notes": research_notes,
        }
    )

    return {
        "current_agent": "Business Model",
        "progress_percentage": 50,
        "business_model": result.model_dump(),
    }
