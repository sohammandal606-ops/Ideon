"""Service responsible for indexing completed LangGraph analyses and documents into pgvector."""

import json
import logging
import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import delete

from db.models.document import DocumentChunk
from services.embedding_service import get_embeddings

logger = logging.getLogger(__name__)


def format_agent_section(section_name: str, data: dict[str, Any]) -> tuple[str, str]:
    """Format structured agent output into (title, semantic_text).

    Returns:
        (title, formatted_text)
    """
    if not data:
        return "", ""

    if section_name == "final_verdict":
        title = "Final Verdict & Viability Assessment"
        top_risks = "\n- ".join(data.get("top_3_risks", []))
        next_steps = "\n- ".join(data.get("next_steps", []))
        text = (
            f"=== {title} ===\n"
            f"Overall Viability Score: {data.get('overall_score', 'N/A')}/100\n"
            f"Investment Decision: {'GO (Pursue)' if data.get('go_no_go_decision') else 'NO-GO (Re-evaluate/Pivot)'}\n"
            f"Executive Summary:\n{data.get('executive_summary', '')}\n\n"
            f"Top Fatal Risks Identified:\n- {top_risks}\n\n"
            f"Recommended Next Strategic Steps:\n- {next_steps}"
        )
        return title, text

    if section_name == "competitor_analysis":
        title = "Competitor Landscape & Moats"
        competitors = data.get("direct_competitors", [])
        if isinstance(competitors, list):
            comp_str = "\n- ".join(
                f"{c.get('name', 'Competitor')}: {c.get('strengths', '')} / Weakness: {c.get('weaknesses', '')}"
                if isinstance(c, dict)
                else str(c)
                for c in competitors
            )
        else:
            comp_str = str(competitors)

        text = (
            f"=== {title} ===\n"
            f"Competitive Moat & Defensibility:\n{data.get('competitive_advantage', 'Not specified')}\n\n"
            f"Direct Competitors:\n- {comp_str}\n\n"
            f"Identified Market Gaps & Opportunities:\n{', '.join(data.get('market_gaps', []))}"
        )
        return title, text

    if section_name == "idea_validation":
        title = "Idea Validation & Weaknesses"
        strengths = "\n- ".join(data.get("strengths", []))
        weaknesses = "\n- ".join(data.get("weaknesses", []))
        text = (
            f"=== {title} ===\n"
            f"Idea Viability Score: {data.get('score', 'N/A')}/100\n"
            f"Logical Problem-Solution Validity: {'Valid' if data.get('is_valid') else 'Questionable'}\n\n"
            f"Core Strengths:\n- {strengths}\n\n"
            f"Core Flaws, Weaknesses & Defensibility Vulnerabilities:\n- {weaknesses}\n\n"
            f"Detailed Feedback:\n{data.get('feedback', '')}"
        )
        return title, text

    if section_name == "market_research":
        title = "Market Sizing & Audience"
        audiences = "\n- ".join(data.get("target_audience", []))
        trends = "\n- ".join(data.get("key_trends", []))
        opps = "\n- ".join(data.get("opportunities", []))
        text = (
            f"=== {title} ===\n"
            f"Market Size (TAM/SAM/SOM):\n{data.get('market_size', 'N/A')}\n\n"
            f"Target Audience Segments:\n- {audiences}\n\n"
            f"Current Market Trends:\n- {trends}\n\n"
            f"Growth Opportunities:\n- {opps}"
        )
        return title, text

    if section_name == "business_model":
        title = "Business Model & Monetization"
        streams = "\n- ".join(data.get("revenue_streams", []))
        costs = "\n- ".join(data.get("cost_structure", []))
        text = (
            f"=== {title} ===\n"
            f"Pricing Strategy:\n{data.get('pricing_strategy', 'N/A')}\n\n"
            f"Revenue Streams:\n- {streams}\n\n"
            f"Cost Structure & Unit Economics:\n- {costs}"
        )
        return title, text

    if section_name == "financial_analysis":
        title = "Financial Projections & Runway"
        text = (
            f"=== {title} ===\n"
            f"Break-even Point: {data.get('break_even_point', 'N/A')}\n"
            f"Monthly Burn Rate: {data.get('monthly_burn_rate', 'N/A')}\n"
            f"Estimated Runway: {data.get('runway_months', 'N/A')} months\n"
            f"Financial Summary & Assumptions:\n{json.dumps(data.get('key_assumptions', {}), indent=2)}"
        )
        return title, text

    if section_name == "mvp_plan":
        title = "MVP Scope & Feature Plan"
        features = "\n- ".join(data.get("core_features", []))
        text = (
            f"=== {title} ===\n"
            f"Timeline: {data.get('timeline_weeks', 'N/A')} weeks\n"
            f"Recommended Tech Stack:\n{', '.join(data.get('tech_stack', []))}\n\n"
            f"Must-Have Core MVP Features:\n- {features}"
        )
        return title, text

    if section_name == "gtm_strategy":
        title = "Go-to-Market & Acquisition"
        channels = "\n- ".join(data.get("channels", []))
        tactics = "\n- ".join(data.get("tactics", []))
        text = (
            f"=== {title} ===\n"
            f"Launch Acquisition Channels:\n- {channels}\n\n"
            f"Conversion Tactics:\n- {tactics}\n\n"
            f"Positioning Message:\n{data.get('positioning', 'N/A')}"
        )
        return title, text

    # Fallback for unrecognized section
    title = section_name.replace("_", " ").title()
    text = f"=== {title} ===\n" + "\n".join(f"{k}: {v}" for k, v in data.items())
    return title, text


async def index_completed_analysis(
    session: AsyncSession,
    startup_id: uuid.UUID,
    analysis_id: uuid.UUID,
    final_state: dict[str, Any],
) -> int:
    """Chunks and embeds each specialist agent's report into pgvector.

    Cleans up any previously indexed chunks for this startup to ensure
    the knowledge base reflects the newest analysis.
    """
    sections = [
        "idea_validation",
        "market_research",
        "competitor_analysis",
        "business_model",
        "financial_analysis",
        "mvp_plan",
        "gtm_strategy",
        "final_verdict",
    ]

    items_to_embed: list[dict[str, str]] = []
    texts: list[str] = []

    for sec in sections:
        sec_data = final_state.get(sec)
        if not sec_data:
            continue
        title, formatted_text = format_agent_section(sec, sec_data)
        if formatted_text.strip():
            items_to_embed.append({
                "section": sec,
                "title": title,
                "content": formatted_text,
            })
            texts.append(formatted_text)

    if not items_to_embed:
        logger.warning("No agent sections to index for analysis %s", analysis_id)
        return 0

    # 1. Generate embeddings
    embeddings = get_embeddings()
    vectors = await embeddings.aembed_documents(texts)

    # 2. Delete existing analysis chunks for this startup to keep latest state fresh
    delete_stmt = delete(DocumentChunk).where(
        DocumentChunk.startup_id == startup_id,
        DocumentChunk.section.in_(sections),
    )
    await session.exec(delete_stmt)

    # 3. Insert new chunk records
    for item, vector in zip(items_to_embed, vectors):
        chunk = DocumentChunk(
            startup_id=startup_id,
            analysis_id=analysis_id,
            section=item["section"],
            title=item["title"],
            content=item["content"],
            metadata_={"type": "analysis_output", "section": item["section"]},
            embedding=vector,
        )
        session.add(chunk)

    await session.commit()
    logger.info(
        "Successfully indexed %d analysis report chunks for startup %s into pgvector",
        len(items_to_embed),
        startup_id,
    )
    return len(items_to_embed)


async def index_founder_document(
    session: AsyncSession,
    startup_id: uuid.UUID,
    title: str,
    content: str,
    section: str = "founder_note",
) -> int:
    """Index an uploaded founder document, note, or pitch transcript."""
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=120)
    chunks = splitter.split_text(content)
    if not chunks:
        return 0

    embeddings = get_embeddings()
    vectors = await embeddings.aembed_documents(chunks)

    for idx, (chunk_text, vector) in enumerate(zip(chunks, vectors)):
        doc = DocumentChunk(
            startup_id=startup_id,
            section=section,
            title=f"{title} (Part {idx + 1})",
            content=chunk_text,
            metadata_={"type": "founder_document", "part": idx + 1},
            embedding=vector,
        )
        session.add(doc)

    await session.commit()
    return len(chunks)
