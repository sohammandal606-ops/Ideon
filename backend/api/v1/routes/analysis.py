from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from api.v1.deps import get_current_user
from schemas.analysis import (
    AnalysisRunCreate,
    AnalysisRunResponse,
)
from services.analysis_service import AnalysisService


router = APIRouter(
    prefix="/api/v1/startups",
    tags=["Startup Analysis"],
)


#start analysis...

@router.post(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def start_analysis(
    startup_id: UUID,
    analysis_data: AnalysisRunCreate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
) -> AnalysisRunResponse:
    """
    Start AI analysis for a startup.

    User flow:

        Create Startup
            ↓
        Enter Idea
            ↓
        Click Analyze
            ↓
        Create AnalysisRun
            ↓
        Start LangGraph
    """

    return AnalysisService.start_analysis(
        startup_id=startup_id,
        user_id=current_user["user_id"],
        force_re_run=analysis_data.force_re_run,
    )


#get latest analysis...

@router.get(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK,
)
def get_latest_analysis(
    startup_id: UUID,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
) -> AnalysisRunResponse:
    """
    Get the latest analysis run.

    Used by Streamlit to:
        - Check analysis status
        - Display progress
        - Display final results
    """

    return AnalysisService.get_latest_analysis(
        startup_id=startup_id,
        user_id=current_user["user_id"],
    )


#get specific analysis...

@router.get(
    "/{startup_id}/analysis/{run_id}",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK,
)
def get_analysis_run(
    startup_id: UUID,
    run_id: UUID,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
) -> AnalysisRunResponse:
    """
    Get a specific analysis run.

    Useful for:
        - Tracking a particular run
        - Viewing historical runs
        - Retrieving final analysis
    """

    return AnalysisService.get_analysis_run(
        startup_id=startup_id,
        run_id=run_id,
        user_id=current_user["user_id"],
    )