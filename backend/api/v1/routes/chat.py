"""API route for the Post-Analysis AI Consultant RAG Chat."""

from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from api.v1.deps import DatabaseSession, get_current_db_user
from db.models.user import User
from db.repositories.startup_repository import StartupRepository
from services.analysis_service import get_analysis_service
from services.consultant_service import AIConsultantService
from services.rag_indexer import index_completed_analysis

router = APIRouter(prefix="/api/v1/startups/{startup_id}/chat", tags=["consultant_chat"])

CurrentDBUser = Annotated[User, Depends(get_current_db_user)]


class ChatMessageItem(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000, description="Founder's question")
    history: list[ChatMessageItem] = Field(default_factory=list, description="Recent conversation turns")


class CitationItem(BaseModel):
    section: str
    title: str
    preview: str


class ChatResponse(BaseModel):
    reply: str
    citations: list[CitationItem] = []


@router.post("", response_model=ChatResponse)
async def chat_with_consultant(
    startup_id: UUID,
    payload: ChatRequest,
    session: DatabaseSession,
    db_user: CurrentDBUser,
) -> ChatResponse:
    """Ask the AI Consultant a question about the startup analysis dossier using RAG."""
    # Verify startup belongs to user
    startup_repo = StartupRepository()
    startup = await startup_repo.get_by_id(session, startup_id)
    if not startup or startup.user_id != db_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        )

    consultant = AIConsultantService(session)
    history_dicts = [{"role": m.role, "content": m.content} for m in payload.history]
    result = await consultant.answer_question(
        startup_id=startup_id,
        question=payload.message,
        chat_history=history_dicts,
    )

    return ChatResponse(
        reply=result["reply"],
        citations=[CitationItem(**c) for c in result.get("citations", [])],
    )


@router.post("/reindex", status_code=status.HTTP_200_OK)
async def force_reindex_analysis(
    startup_id: UUID,
    session: DatabaseSession,
    db_user: CurrentDBUser,
) -> dict[str, Any]:
    """Force re-indexing of the latest completed analysis into pgvector."""
    startup_repo = StartupRepository()
    startup = await startup_repo.get_by_id(session, startup_id)
    if not startup or startup.user_id != db_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        )

    analysis_service = get_analysis_service()
    latest = await analysis_service.analysis_repository.get_latest(session, startup_id)
    if not latest or not latest.final_state_snapshot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No completed analysis available to index",
        )

    count = await index_completed_analysis(
        session=session,
        startup_id=startup_id,
        analysis_id=latest.id,
        final_state=latest.final_state_snapshot,
    )

    return {"status": "ok", "indexed_chunks": count}
