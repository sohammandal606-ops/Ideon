"""AI Consultant service using RAG to answer founder questions based on analysis dossier."""

import logging
from typing import Any
from uuid import UUID

from langchain_core.prompts import ChatPromptTemplate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from db.models.document import DocumentChunk
from services.analysis_service import get_analysis_service
from services.embedding_service import get_embeddings
from services.llm_service import get_agent_llm

logger = logging.getLogger(__name__)


class AIConsultantService:
    """Provides conversational RAG consultation for founders grounded in their startup's analysis."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.embeddings = get_embeddings()
        self.llm = get_agent_llm("CONSULTANT")

    async def answer_question(
        self,
        startup_id: UUID,
        question: str,
        chat_history: list[dict[str, str]] | None = None,
        top_k: int = 4,
    ) -> dict[str, Any]:
        """Answer a founder's question using pgvector cosine similarity search."""
        # 1. Ensure latest analysis is indexed into pgvector
        analysis_service = get_analysis_service()
        await analysis_service.ensure_analysis_indexed(self.session, startup_id)

        # 2. Compute query embedding
        query_vector = await self.embeddings.aembed_query(question)

        # 3. Perform cosine similarity search with pgvector
        stmt = (
            select(DocumentChunk)
            .where(DocumentChunk.startup_id == startup_id)
            .order_by(DocumentChunk.embedding.cosine_distance(query_vector))
            .limit(top_k)
        )
        result = await self.session.exec(stmt)
        chunks = list(result.all())

        if not chunks:
            return {
                "reply": (
                    "I don't have enough analysis data for this startup yet. "
                    "Please run the AI Analysis pipeline first, and I will be ready to give you "
                    "deep strategic guidance and answer questions about your score, market, and moats."
                ),
                "citations": [],
            }

        # 4. Build context string and citations
        context_parts: list[str] = []
        citations: list[dict[str, str]] = []

        for c in chunks:
            context_parts.append(f"### {c.title.upper()} ({c.section})\n{c.content}")
            citations.append({
                "section": c.section,
                "title": c.title,
                "preview": c.content[:160].replace("\n", " ") + "...",
            })

        dossier_context = "\n\n".join(context_parts)

        # 5. Formulate prompt
        system_instruction = (
            "You are IDEON's Principal Startup Advisor and seasoned VC Partner. "
            "You are having a 1-on-1 consultation with a founder about their startup idea. "
            "You have access to the verified analysis dossier from IDEON's specialist agents.\n\n"
            "GUIDELINES:\n"
            "1. Answer the founder's question directly, concisely, and constructively.\n"
            "2. Cite the exact sections you are pulling insights from (e.g., 'According to your Competitor Analysis...', 'Your Final Verdict noted...').\n"
            "3. If they ask about low scores, defensibility, or fatal risks, explain the underlying mechanism that caused the score.\n"
            "4. Provide 2-3 clear, actionable next steps or tactical pivots they can execute immediately.\n"
            "5. Maintain an encouraging yet realistic, high-standard VC tone."
        )

        from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

        messages = [SystemMessage(content=system_instruction)]

        # Include recent conversation turns if provided
        if chat_history:
            recent_turns = chat_history[-6:]
            for turn in recent_turns:
                role = turn.get("role", "user")
                content = turn.get("content", "")
                if role in ("user", "human"):
                    messages.append(HumanMessage(content=content))
                elif role in ("assistant", "ai"):
                    messages.append(AIMessage(content=content))

        user_content = (
            f"RELEVANT SECTIONS FROM STARTUP DOSSIER:\n{dossier_context}\n\n"
            f"FOUNDER'S QUESTION:\n{question}"
        )
        messages.append(HumanMessage(content=user_content))

        try:
            response = await self.llm.ainvoke(messages)
            reply_text = (
                response.content
                if hasattr(response, "content")
                else str(response)
            )
        except Exception as err:
            logger.error("LLM consultation failed: %s", err, exc_info=True)
            reply_text = (
                f"I reviewed your startup dossier, but encountered an issue generating the full response: {err}. "
                "Please check your API configuration or try again in a moment."
            )

        return {
            "reply": reply_text,
            "citations": citations,
        }
