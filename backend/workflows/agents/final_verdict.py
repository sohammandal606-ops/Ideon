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
    Provides the final executive summary and go/no-go decision
    based on the COMPLETE dossier from all previous agents.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the Lead Partner at a top tier Venture Capital firm. "
                "You are reviewing the complete dossier on a startup idea to make a final investment decision. "
                "CRITICAL: You must explicitly output a valid JSON containing ALL five fields: "
                "overall_score, executive_summary, go_no_go_decision, top_3_risks, and next_steps.",
            ),
            (
                "user",
                "Startup Name: {startup_name}\n"
                "Description: {description}\n\n"
                "--- IDEA VALIDATION ---\n"
                "Score: {idea_score}\n"
                "Strengths: {idea_strengths}\n"
                "Weaknesses: {idea_weaknesses}\n\n"
                "--- MARKET RESEARCH ---\n"
                "Market Size: {market_size}\n"
                "Target Audience: {target_audience}\n"
                "Key Trends: {key_trends}\n\n"
                "--- COMPETITOR ANALYSIS ---\n"
                "Direct Competitors: {direct_competitors}\n"
                "Competitive Advantage: {competitive_advantage}\n\n"
                "--- BUSINESS MODEL ---\n"
                "Revenue Streams: {revenue_streams}\n"
                "Pricing Strategy: {pricing_strategy}\n"
                "Cost Structure: {cost_structure}\n\n"
                "--- FINANCIAL ANALYSIS ---\n"
                "Startup Costs: {startup_costs}\n"
                "Burn Rate: {burn_rate}\n"
                "Revenue Projections: {revenue_projections}\n"
                "Break-Even: {break_even}\n\n"
                "--- MVP PLAN ---\n"
                "Core Features: {core_features}\n"
                "Tech Stack: {tech_stack}\n"
                "Timeline: {dev_timeline}\n\n"
                "--- GTM STRATEGY ---\n"
                "Launch Channels: {launch_channels}\n"
                "Marketing Tactics: {marketing_tactics}\n"
                "CAC Estimate: {cac_estimate}\n\n"
                "Based on this COMPLETE dossier, provide your final verdict.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(FinalVerdictOutput)

    # --- Extract context from all previous agents ---
    idea = state.get("idea_validation") or {}
    market = state.get("market_research") or {}
    competitor = state.get("competitor_analysis") or {}
    bm = state.get("business_model") or {}
    finance = state.get("financial_analysis") or {}
    mvp = state.get("mvp_plan") or {}
    gtm = state.get("gtm_strategy") or {}

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            # Idea Validation
            "idea_score": str(idea.get("score", "N/A")),
            "idea_strengths": ", ".join(idea.get("strengths", [])),
            "idea_weaknesses": ", ".join(idea.get("weaknesses", [])),
            # Market Research
            "market_size": market.get("market_size", "N/A"),
            "target_audience": ", ".join(market.get("target_audience", [])),
            "key_trends": ", ".join(market.get("key_trends", [])),
            # Competitor Analysis
            "direct_competitors": ", ".join(competitor.get("direct_competitors", [])),
            "competitive_advantage": competitor.get("competitive_advantage", "N/A"),
            # Business Model
            "revenue_streams": ", ".join(bm.get("revenue_streams", [])),
            "pricing_strategy": bm.get("pricing_strategy", "N/A"),
            "cost_structure": ", ".join(bm.get("cost_structure", [])),
            # Financial Analysis
            "startup_costs": finance.get("startup_costs", "N/A"),
            "burn_rate": finance.get("burn_rate_estimate", "N/A"),
            "revenue_projections": finance.get("revenue_projections", "N/A"),
            "break_even": finance.get("break_even_timeline", "N/A"),
            # MVP Plan
            "core_features": ", ".join(mvp.get("core_features", [])),
            "tech_stack": ", ".join(mvp.get("tech_stack_recommendation", [])),
            "dev_timeline": mvp.get("development_timeline", "N/A"),
            # GTM Strategy
            "launch_channels": ", ".join(gtm.get("launch_channels", [])),
            "marketing_tactics": ", ".join(gtm.get("marketing_tactics", [])),
            "cac_estimate": gtm.get("customer_acquisition_cost_estimate", "N/A"),
        }
    )

    return {
        "current_agent": "Final Verdict",
        "progress_percentage": 100,
        "final_verdict": result.model_dump(),
    }

