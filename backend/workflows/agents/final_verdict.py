from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


class FinalVerdictOutput(BaseModel):
    overall_score: int = Field(
        description="Final viability score from 1 to 100 based on all research."
    )
    executive_summary: str = Field(
        description="A concise 2-3 paragraph summary of the startup's potential."
    )
    go_no_go_decision: bool = Field(
        description="True if the founder should pursue this, False if they should pivot."
    )
    top_3_risks: list[str] = Field(
        description="The 3 biggest risks that could kill the startup."
    )
    next_steps: list[str] = Field(
        description="The immediate next 3 steps the founder should take."
    )


async def final_verdict_node(state: StartupState) -> dict:
    """
    Provides the final executive summary and go/no-go decision.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the Lead Partner at a top tier Venture Capital firm. "
                "You are reviewing the complete dossier on a startup idea to make a final decision.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n"
                "Idea Score: {idea_score}\n"
                "Market Size: {market_size}\n"
                "Competitive Advantage: {competitive_advantage}\n"
                "Burn Rate: {burn_rate}\n\n"
                "Please provide a structured final verdict and executive summary.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(FinalVerdictOutput)

    idea_score = "None"
    if state.get("idea_validation"):
        idea_score = str(state["idea_validation"].get("score", "None"))

    market_size = "None"
    if state.get("market_research"):
        market_size = state["market_research"].get("market_size", "None")

    competitive_advantage = "None"
    if state.get("competitor_analysis"):
        competitive_advantage = state["competitor_analysis"].get("competitive_advantage", "None")

    burn_rate = "None"
    if state.get("financial_analysis"):
        burn_rate = state["financial_analysis"].get("burn_rate_estimate", "None")

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "idea_score": idea_score,
            "market_size": market_size,
            "competitive_advantage": competitive_advantage,
            "burn_rate": burn_rate,
        }
    )

    return {
        "current_agent": "Final Verdict",
        "progress_percentage": 100,
        "final_verdict": result.model_dump(),
    }
