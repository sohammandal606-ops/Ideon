from typing import Any, TypedDict


class StartupState(TypedDict):
    """
    Represents the state of the LangGraph workflow.
    """

    # Inputs (from AnalysisRun inputs_snapshot)
    startup_id: str
    startup_name: str
    description: str
    industry: str | None
    target_market: str | None
    additional_info: str | None

    # Workflow tracking
    current_agent: str | None
    progress_percentage: int

    # Outputs (Agent results)
    idea_validation: dict[str, Any] | None
    market_research: dict[str, Any] | None
    competitor_analysis: dict[str, Any] | None
    business_model: dict[str, Any] | None
    financial_analysis: dict[str, Any] | None
    mvp_plan: dict[str, Any] | None
    gtm_strategy: dict[str, Any] | None
    final_verdict: dict[str, Any] | None
