from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel, Field

from core.config import settings
from workflows.state import StartupState
from workflows.utils import run_research_agent


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
    Generates a high-level financial analysis using web data.
    """
    api_key = (
        settings.MISTRAL_API_KEY_FINANCIAL_ANALYSIS.get_secret_value()
        if settings.MISTRAL_API_KEY_FINANCIAL_ANALYSIS
        else (
            settings.MISTRAL_API_KEY.get_secret_value()
            if settings.MISTRAL_API_KEY
            else None
        )
    )
    if not api_key:
        raise ValueError(
            "MISTRAL_API_KEY_FINANCIAL_ANALYSIS (or MISTRAL_API_KEY) is not configured."
        )

    llm = ChatMistralAI(
        model=settings.MISTRAL_MODEL_FINANCIAL_ANALYSIS or settings.MISTRAL_MODEL,
        temperature=settings.MISTRAL_TEMPERATURE_FINANCIAL_ANALYSIS
        if settings.MISTRAL_TEMPERATURE_FINANCIAL_ANALYSIS is not None
        else settings.MISTRAL_TEMPERATURE,
        max_retries=3,
        api_key=api_key,
    )

    # 1. Live Web Research Phase
    research_prompt = (
        f"What are the typical startup costs and burn rates for a software startup in the {state.get('industry')} sector? "
        f"Looking for benchmark data for {state.get('description')}."
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
                "You are a CFO and financial modeler for early-stage startups. "
                "Provide realistic financial estimates based on the business model and research notes. "
                "CRITICAL: You must explicitly output a valid JSON containing ALL four fields: startup_costs, burn_rate_estimate, revenue_projections, and break_even_timeline.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Business Model: {business_model}\n\n"
                "Live Web Industry Financials:\n{research_notes}\n\n"
                "Please provide a structured financial analysis.",
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
            "research_notes": research_notes,
        }
    )

    return {
        "current_agent": "Financial Analysis",
        "progress_percentage": 60,
        "financial_analysis": result.model_dump(),
    }
