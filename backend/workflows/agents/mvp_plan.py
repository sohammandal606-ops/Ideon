from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


class MvpPlanOutput(BaseModel):
    core_features: list[str] = Field(
        description="The absolute minimum features required for the first release."
    )
    tech_stack_recommendation: list[str] = Field(
        description="Recommended technologies to build the MVP quickly."
    )
    development_timeline: str = Field(
        description="Estimated time to build and launch the MVP."
    )
    success_metrics: list[str] = Field(
        description="Key metrics to track to validate the MVP's success."
    )


async def mvp_plan_node(state: StartupState) -> dict:
    """
    Defines the Minimum Viable Product plan.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert CTO and product manager. "
                "Design a lean and pragmatic MVP (Minimum Viable Product) for this startup.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Target Audience: {target_audience}\n\n"
                "Please provide a structured MVP plan including features, tech stack, and metrics.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(MvpPlanOutput)

    target_audience = "None"
    if state.get("market_research"):
        audience = state["market_research"].get("target_audience", [])
        target_audience = ", ".join(audience) if audience else "None"

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "target_audience": target_audience,
        }
    )

    return {
        "current_agent": "MVP Plan",
        "progress_percentage": 70,
        "mvp_plan": result.model_dump(),
    }
