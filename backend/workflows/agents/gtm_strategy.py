from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState
from workflows.utils import run_research_agent


class GtmStrategyOutput(BaseModel):
    launch_channels: list[str] = Field(
        description="Best platforms or channels to launch the product (e.g., ProductHunt, Reddit)."
    )
    marketing_tactics: list[str] = Field(
        description="Specific tactics to acquire the first 100-1000 users."
    )
    customer_acquisition_cost_estimate: str = Field(
        description="Estimated CAC for the initial growth phase."
    )
    early_adopter_profile: str = Field(
        description="The exact persona of the people most desperate for this product."
    )


async def gtm_strategy_node(state: StartupState) -> dict:
    """
    Formulates a Go-To-Market strategy using live web search.
    """
    llm = get_llm()
    
    # 1. Live Web Research Phase
    research_prompt = (
        f"What are the most effective modern marketing channels and typical Customer Acquisition Costs (CAC) "
        f"for startups in the {state.get('industry')} sector targeting {state.get('target_market')}?"
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
                "You are a brilliant Growth Hacker and CMO. "
                "Design a scrappy, effective Go-To-Market (GTM) strategy using the provided research. "
                "CRITICAL: You must explicitly output a valid JSON containing ALL four fields: launch_channels, marketing_tactics, customer_acquisition_cost_estimate, and early_adopter_profile.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "MVP Features: {mvp_features}\n"
                "Target Audience: {target_audience}\n\n"
                "Live Web Marketing Trends:\n{research_notes}\n\n"
                "Please provide a structured GTM strategy for launch.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(GtmStrategyOutput)

    mvp_features = "None"
    if state.get("mvp_plan"):
        features = state["mvp_plan"].get("core_features", [])
        mvp_features = ", ".join(features) if features else "None"

    target_audience = "None"
    if state.get("market_research"):
        audience = state["market_research"].get("target_audience", [])
        target_audience = ", ".join(audience) if audience else "None"

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "mvp_features": mvp_features,
            "target_audience": target_audience,
            "research_notes": research_notes,
        }
    )

    return {
        "current_agent": "GTM Strategy",
        "progress_percentage": 85,
        "gtm_strategy": result.model_dump(),
    }
