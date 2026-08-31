from langgraph.graph import END, StateGraph

from workflows.agents import (
    business_model_node,
    competitor_analysis_node,
    final_verdict_node,
    financial_analysis_node,
    gtm_strategy_node,
    idea_validator_node,
    market_research_node,
    mvp_plan_node,
)
from workflows.state import StartupState


def create_workflow():
    """
    Creates and compiles the IDEON LangGraph workflow.
    """
    workflow = StateGraph(StartupState)

    # Add nodes
    workflow.add_node("idea_validator", idea_validator_node)
    workflow.add_node("market_research", market_research_node)
    workflow.add_node("competitor_analysis", competitor_analysis_node)
    workflow.add_node("business_model", business_model_node)
    workflow.add_node("financial_analysis", financial_analysis_node)
    workflow.add_node("mvp_plan", mvp_plan_node)
    workflow.add_node("gtm_strategy", gtm_strategy_node)
    workflow.add_node("final_verdict", final_verdict_node)

    # Define execution order (Edges)
    workflow.set_entry_point("idea_validator")

    workflow.add_edge("idea_validator", "market_research")
    workflow.add_edge("idea_validator", "competitor analysis")
    workflow.add_edge("market_research", "business_model")
    workflow.add_edge("competitor_analysis", "business_model")
    workflow.add_edge("business_model", "financial_analysis")
    workflow.add_edge("financial_analysis", "mvp_plan")
    workflow.add_edge("mvp_plan", "gtm_strategy")
    workflow.add_edge("gtm_strategy", "final_verdict")

    # End the workflow after final verdict
    workflow.add_edge("final_verdict", END)

    return workflow.compile()


# This is the instance imported by analysis_service.py
startup_workflow = create_workflow()
