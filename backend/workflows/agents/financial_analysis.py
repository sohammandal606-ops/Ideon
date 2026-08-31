from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


class FinancialAnalysisOutput(BaseModel):
    startup_costs: str = Field(
        description="Estimated initial capital required to launch."
    )
    burn_rate_estimate: str = Field(
        description="Estimated monthly burn rate for the first year."
    )
    revenue_projections: str = Field(
        description="High-level revenue projections for year 1 and year 3."
    )
    break_even_timeline: str = Field(
        description="Estimated timeline to reach profitability."
    )


async def financial_analysis_node(state: StartupState) -> dict:
    """
    Generates a high-level financial analysis for the startup.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a CFO and financial modeler for early-stage startups. "
                "Provide realistic financial estimates and projections based on the business model.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Business Model: {business_model}\n\n"
                "Please provide a structured financial analysis with costs, burn rate, and projections.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(FinancialAnalysisOutput)

    business_model_context = "None"
    if state.get("business_model"):
        bm = state["business_model"]
        revenue = ", ".join(bm.get("revenue_streams", []))
        costs = ", ".join(bm.get("cost_structure", []))
        business_model_context = f"Revenue Streams: {revenue}. Cost Drivers: {costs}."

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "business_model": business_model_context,
        }
    )

    return {
        "current_agent": "Financial Analysis",
        "progress_percentage": 60,
        "financial_analysis": result.model_dump(),
    }
