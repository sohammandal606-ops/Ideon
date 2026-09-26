"""
Business logic for Startup Analysis management.

This service acts as a bridge between the API routes,
analysis workflow, and database repository.

Responsibilities:
    - Verify startup ownership
    - Create and manage analysis runs
    - Start the LangGraph workflow
    - Store analysis results
    - Retrieve analysis runs
    - Handle analysis failures

Architecture:

    API Route
        ↓
    AnalysisService
        ↓
    StartupRepository
        ↓
    AnalysisRepository
        ↓
    LangGraph Workflow
        ↓
    Mistral AI
"""

from uuid import UUID

from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.analysis import AnalysisRun
from db.repositories.analysis_repository import AnalysisRepository
from db.repositories.startup_repository import StartupRepository
from schemas.analysis import (
    AnalysisStatus,
)
from workflows.workflow import startup_workflow


class AnalysisNotFoundError(Exception):
    """Raised when an analysis run doesn't exist or is inaccessible."""


class StartupNotFoundError(Exception):
    """Raised when a startup doesn't exist or doesn't belong to the user."""


class AnalysisAlreadyRunningError(Exception):
    """Raised when an analysis is already running for a startup."""


class AnalysisAlreadyExistsError(Exception):
    """Raised when an analysis already exists and re-run is not requested."""


class AnalysisService:
    """Application logic for startup AI analysis."""

    def __init__(
        self,
        analysis_repository: AnalysisRepository,
        startup_repository: StartupRepository,
    ) -> None:
        self.analysis_repository = analysis_repository
        self.startup_repository = startup_repository

    # --- Start Analysis ---

    async def start_analysis(
        self,
        session: AsyncSession,
        startup_id: UUID,
        user_id: UUID,
        force_re_run: bool = False,
    ) -> AnalysisRun:
        """
        Start an AI analysis for a startup.

        The startup must belong to the authenticated user.
        """

        # Verify ownership

        startup = await self.startup_repository.get_by_id(
            session,
            startup_id,
        )

        if not startup or startup.user_id != user_id:
            raise StartupNotFoundError("Startup not found")

        # Check if an analysis is already running

        running_analysis = await self.analysis_repository.get_running(
            session,
            startup_id,
        )

        if running_analysis:
            raise AnalysisAlreadyRunningError(
                "An analysis is already running for this startup"
            )

        # Check the previous analysis

        latest_analysis = await self.analysis_repository.get_latest(
            session,
            startup_id,
        )

        if (
            latest_analysis
            and latest_analysis.status == AnalysisStatus.COMPLETED
            and not force_re_run
        ):
            raise AnalysisAlreadyExistsError(
                "Analysis already exists. "
                "Use force_re_run=true to run the analysis again."
            )

        # Create a new analysis run

        inputs_snapshot = {
            "name": startup.name,
            "description": startup.description,
            "industry": startup.industry,
            "target_market": startup.target_market,
            "additional_info": startup.additional_info,
        }

        analysis = await self.analysis_repository.create(
            session=session,
            startup_id=startup_id,
            inputs_snapshot=inputs_snapshot,
        )

        # Build initial LangGraph state

        initial_state = {
            "startup_id": str(startup.id),
            "startup_name": startup.name,
            "description": startup.description,
            "industry": startup.industry,
            "target_market": startup.target_market,
            "additional_info": startup.additional_info,
            # Agent outputs
            "idea_validation": None,
            "market_research": None,
            "competitor_analysis": None,
            "business_model": None,
            "financial_analysis": None,
            "mvp_plan": None,
            "gtm_strategy": None,
            "final_verdict": None,
            # Workflow tracking
            "current_agent": None,
            "progress_percentage": 0,
        }
        # Execute the LangGraph workflow

        try:
            await self.analysis_repository.mark_in_progress(
                session=session,
                analysis=analysis,
            )

            final_state = await self._run_workflow(initial_state)

            # Save the final workflow state

            await self.analysis_repository.mark_completed(
                session=session,
                analysis=analysis,
                final_state_snapshot=final_state,
            )

        except Exception as exc:
            # Save failure info

            await self.analysis_repository.mark_failed(
                session=session,
                analysis=analysis,
                error_message=str(exc),
            )

        # Return the updated analysis

        updated_analysis = await self.analysis_repository.get_by_id(
            session,
            analysis.id,
        )

        if not updated_analysis:
            raise AnalysisNotFoundError("Analysis run not found after creation")

        return updated_analysis

    # langgraph workflow...

    async def _run_workflow(
        self,
        initial_state: dict,
    ) -> dict:
        """
        Execute the IDEON LangGraph workflow.

        Agent flow:

            Idea Validator
                    ↓
             ┌──────┴──────┐
             ↓             ↓
        Market Research  Competitor
             ↓             ↓
             └──────┬──────┘
                    ↓
             Business Model
                    ↓
             Financial Analysis
                    ↓
                MVP Planner
                    ↓
                GTM Strategy
                    ↓
                Final Verdict
        """

        # If  LangGraph workflow is synchronous:
        #
        # final_state = startup_workflow.invoke(
        #     initial_state
        # )
        #
        # If your workflow is asynchronous:
        # use ainvoke().

        final_state = await startup_workflow.ainvoke(initial_state)

        return final_state

    # get latest analysis...

    async def get_latest_analysis(
        self,
        session: AsyncSession,
        startup_id: UUID,
        user_id: UUID,
    ) -> AnalysisRun:
        """
        Get the latest analysis for a startup.
        """

        # verify the the startup ownership...

        startup = await self.startup_repository.get_by_id(
            session,
            startup_id,
        )

        if not startup or startup.user_id != user_id:
            raise StartupNotFoundError("Startup not found")

        # get the latest analysisi...

        analysis = await self.analysis_repository.get_latest(
            session,
            startup_id,
        )

        if not analysis:
            raise AnalysisNotFoundError("No analysis found for this startup")

        return analysis

    # get specific analysis run....

    async def get_analysis_run(
        self,
        session: AsyncSession,
        startup_id: UUID,
        run_id: UUID,
        user_id: UUID,
    ) -> AnalysisRun:
        """
        Get a specific analysis run.

        Security:
            The startup must belong to the authenticated user.
            The analysis must belong to that startup.
        """

        # verify the startup wonership...

        startup = await self.startup_repository.get_by_id(
            session,
            startup_id,
        )

        if not startup or startup.user_id != user_id:
            raise StartupNotFoundError("Startup not found")

        # get analysis...

        analysis = await self.analysis_repository.get_by_id(
            session,
            run_id,
        )

        # -verify the analysis it belong to the startup or not...

        if not analysis or analysis.startup_id != startup_id:
            raise AnalysisNotFoundError("Analysis run not found")

        return analysis


# Dependencies....


def get_analysis_service() -> AnalysisService:
    """
    Dependency provider for FastAPI routes.
    """

    return AnalysisService(
        analysis_repository=AnalysisRepository(),
        startup_repository=StartupRepository(),
    )
