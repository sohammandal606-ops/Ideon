from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from api.v1.deps import DatabaseSession, get_current_user
from schemas.analysis import (
    AnalysisRunCreate,
    AnalysisRunResponse,
)
from services.analysis_service import AnalysisService, get_analysis_service

router = APIRouter(
    prefix="/api/v1/startups",
    tags=["Startup Analysis"],
)


# --- Start Analysis ---


@router.post(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def start_analysis(
    startup_id: UUID,
    analysis_data: AnalysisRunCreate,
    session: DatabaseSession,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    analysis_service: Annotated[
        AnalysisService,
        Depends(get_analysis_service),
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

    return await analysis_service.start_analysis(
        session=session,
        startup_id=startup_id,
        user_id=UUID(current_user["sub"]),
        force_re_run=analysis_data.force_re_run,
    )


# --- Get Latest Analysis ---


@router.get(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK,
)
async def get_latest_analysis(
    startup_id: UUID,
    session: DatabaseSession,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    analysis_service: Annotated[
        AnalysisService,
        Depends(get_analysis_service),
    ],
) -> AnalysisRunResponse:
    """
    Get the latest analysis run.

    Used by Streamlit to:
        - Check analysis status
        - Display progress
        - Display final results
    """

    return await analysis_service.get_latest_analysis(
        session=session,
        startup_id=startup_id,
        user_id=UUID(current_user["sub"]),
    )


# --- Get Specific Analysis Run ---


@router.get(
    "/{startup_id}/analysis/{run_id}",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK,
)
async def get_analysis_run(
    startup_id: UUID,
    run_id: UUID,
    session: DatabaseSession,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    analysis_service: Annotated[
        AnalysisService,
        Depends(get_analysis_service),
    ],
) -> AnalysisRunResponse:
    """
    Get a specific analysis run.

    Useful for:
        - Tracking a particular run
        - Viewing historical runs
        - Retrieving final analysis
    """

    return await analysis_service.get_analysis_run(
        session=session,
        startup_id=startup_id,
        run_id=run_id,
        user_id=UUID(current_user["sub"]),
    )
