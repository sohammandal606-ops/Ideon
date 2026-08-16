from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from db.models.analysis import AnalysisRun
from schemas.analysis import AnalysisStatus


class AnalysisRepository:
    """Handles database operations for Analysis Runs."""

    async def create(
        self,
        session: AsyncSession,
        startup_id: UUID,
    ) -> AnalysisRun:
        """
        Create a new analysis run.

        Every new analysis starts with PENDING status.
        """

        analysis = AnalysisRun(
            startup_id=startup_id,
            status=AnalysisStatus.PENDING,
            current_agent=None,
            progress_percentage=0,
            error_message=None,
            final_state_snapshot=None,
            started_at=None,
            completed_at=None,
        )

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis

    async def get_by_id(
        self,
        session: AsyncSession,
        analysis_id: UUID,
    ) -> AnalysisRun | None:
        """
        Get an analysis run by its ID.
        """

        return await session.get(
            AnalysisRun,
            analysis_id,
        )

    async def get_latest(
        self,
        session: AsyncSession,
        startup_id: UUID,
    ) -> AnalysisRun | None:
        """
        Get the latest analysis run for a startup.
        """

        statement = (
            select(AnalysisRun)
            .where(
                AnalysisRun.startup_id == startup_id
            )
            .order_by(
                AnalysisRun.created_at.desc()
            )
            .limit(1)
        )

        result = await session.exec(statement)

        return result.first()

    async def get_running(
        self,
        session: AsyncSession,
        startup_id: UUID,
    ) -> AnalysisRun | None:
        """
        Get an active analysis run for a startup.

        An analysis is considered active when its status is:
            - PENDING
            - IN_PROGRESS
        """

        statement = (
            select(AnalysisRun)
            .where(
                AnalysisRun.startup_id == startup_id,
                AnalysisRun.status.in_(
                    [
                        AnalysisStatus.PENDING,
                        AnalysisStatus.IN_PROGRESS,
                    ]
                ),
            )
            .order_by(
                AnalysisRun.created_at.desc()
            )
            .limit(1)
        )

        result = await session.exec(statement)

        return result.first()

    async def update_progress(
        self,
        session: AsyncSession,
        analysis: AnalysisRun,
        current_agent: str | None,
        progress_percentage: int,
    ) -> AnalysisRun:
        """
        Update the current agent and analysis progress.
        """

        analysis.current_agent = current_agent

        # Keep progress safely between 0 and 100.
        analysis.progress_percentage = max(
            0,
            min(progress_percentage, 100),
        )

        analysis.updated_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis

    async def mark_in_progress(
        self,
        session: AsyncSession,
        analysis: AnalysisRun,
        current_agent: str | None = None,
        progress_percentage: int = 0,
    ) -> AnalysisRun:
        """
        Mark an analysis run as IN_PROGRESS.
        """

        analysis.status = AnalysisStatus.IN_PROGRESS

        analysis.current_agent = current_agent

        analysis.progress_percentage = max(
            0,
            min(progress_percentage, 100),
        )

        if analysis.started_at is None:
            analysis.started_at = datetime.now(
                UTC
            ).replace(tzinfo=None)

        analysis.updated_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis

    async def mark_completed(
        self,
        session: AsyncSession,
        analysis: AnalysisRun,
        final_state_snapshot: dict[str, Any],
    ) -> AnalysisRun:
        """
        Mark an analysis run as COMPLETED and save
        the final LangGraph state.
        """

        analysis.status = AnalysisStatus.COMPLETED

        analysis.current_agent = None

        analysis.progress_percentage = 100

        analysis.final_state_snapshot = (
            final_state_snapshot
        )

        analysis.error_message = None

        analysis.completed_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        analysis.updated_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis

    async def mark_failed(
        self,
        session: AsyncSession,
        analysis: AnalysisRun,
        error_message: str,
    ) -> AnalysisRun:
        """
        Mark an analysis run as FAILED and save
        the error message.
        """

        analysis.status = AnalysisStatus.FAILED

        analysis.error_message = error_message

        analysis.updated_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis

    async def update_state_snapshot(
        self,
        session: AsyncSession,
        analysis: AnalysisRun,
        state_snapshot: dict[str, Any],
    ) -> AnalysisRun:
        """
        Save the current LangGraph state.

        This is useful for checkpointing the workflow so that
        the analysis can potentially be resumed or selectively
        re-executed later.
        """

        analysis.final_state_snapshot = state_snapshot

        analysis.updated_at = datetime.now(
            UTC
        ).replace(tzinfo=None)

        session.add(analysis)

        await session.commit()
        await session.refresh(analysis)

        return analysis