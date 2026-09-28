from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from api.v1.deps import DatabaseSession, get_current_db_user
from db.models.user import User
from schemas.analysis import (
    AnalysisRunCreate,
    AnalysisRunResponse,
)
from services.analysis_service import (
    AnalysisAlreadyExistsError,
    AnalysisAlreadyRunningError,
    AnalysisNotFoundError,
    AnalysisService,
    StartupNotFoundError,
    get_analysis_service,
)

router = APIRouter(
    prefix="/api/v1/startups",
    tags=["Startup Analysis"],
)

# Type aliases for cleaner route signatures
CurrentDBUser = Annotated[User, Depends(get_current_db_user)]
InjectedAnalysisService = Annotated[AnalysisService, Depends(get_analysis_service)]


# --- Start Analysis ---


@router.post(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def start_analysis(
    startup_id: UUID,
    analysis_data: AnalysisRunCreate,
    background_tasks: BackgroundTasks,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    analysis_service: InjectedAnalysisService,
) -> AnalysisRunResponse:
    """
    Start AI analysis for a startup.
    """

    try:
        analysis = await analysis_service.start_analysis(
            session=session,
            startup_id=startup_id,
            user_id=db_user.id,
            force_re_run=analysis_data.force_re_run,
        )
        background_tasks.add_task(analysis_service.run_analysis, analysis.id)
        return analysis
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found or does not belong to you.",
        ) from None
    except AnalysisAlreadyRunningError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An analysis is already running for this startup.",
        ) from None
    except AnalysisAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Analysis already exists. Use force_re_run=true to run again.",
        ) from None


# --- Get Latest Analysis ---


@router.get(
    "/{startup_id}/analysis",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK,
)
async def get_latest_analysis(
    startup_id: UUID,
    session: DatabaseSession,
    db_user: CurrentDBUser,
    analysis_service: InjectedAnalysisService,
) -> AnalysisRunResponse:
    """
    Get the latest analysis run.
    """

    try:
        return await analysis_service.get_latest_analysis(
            session=session,
            startup_id=startup_id,
            user_id=db_user.id,
        )
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found or does not belong to you.",
        ) from None
    except AnalysisNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No analysis found for this startup.",
        ) from None


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
    db_user: CurrentDBUser,
    analysis_service: InjectedAnalysisService,
) -> AnalysisRunResponse:
    """
    Get a specific analysis run.
    """

    try:
        return await analysis_service.get_analysis_run(
            session=session,
            startup_id=startup_id,
            run_id=run_id,
            user_id=db_user.id,
        )
    except StartupNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found or does not belong to you.",
        ) from None
    except AnalysisNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run not found.",
        ) from None
