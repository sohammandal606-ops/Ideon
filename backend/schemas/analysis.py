
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field



class AnalysisStatus(str, Enum):
    """
    Current status of an analysis workflow.
    """

    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"




class AnalysisAgent(str, Enum):
    """
    Agents participating in the IDEON analysis workflow.
    """

    IDEA_VALIDATOR = "idea_validator"
    MARKET_RESEARCH = "market_research"
    COMPETITOR_ANALYSIS = "competitor_analysis"
    BUSINESS_MODEL = "business_model"
    FINANCIAL_ANALYSIS = "financial_analysis"
    MVP_PLANNER = "mvp_planner"
    GTM_STRATEGY = "gtm_strategy"
    VERDICT = "verdict"




class AnalysisRunCreate(BaseModel):
    """
    Request body used when the user clicks
    'Analyze Startup'.
    """

    model_config = ConfigDict(
        extra="forbid"
    )

    force_re_run: bool = Field(
        default=False,
        description=(
            "Force a new analysis even if a previous "
            "analysis exists."
        ),
    )




class AnalysisRunResponse(BaseModel):
    """
    Response returned to the frontend for an analysis run.
    """

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    startup_id: UUID

    status: AnalysisStatus

    # Currently executing agent
    current_agent: AnalysisAgent | None = None

    # Overall workflow progress
    progress_percentage: int = Field(
        default=0,
        ge=0,
        le=10,
    )

    # Error information if workflow fails
    error_message: str | None = None

    # Complete LangGraph state after completion
    final_state_snapshot: dict[str, Any] | None = None

    # Workflow timestamps
    started_at: datetime | None = None

    completed_at: datetime | None = None

    created_at: datetime

    updated_at: datetime