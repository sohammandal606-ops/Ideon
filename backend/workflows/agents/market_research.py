"""
Market Research Agent.

Workflow:

StartupState
     ↓
Generate research queries
     ↓
ResearchService
     ↓
Web Search
     ↓
Page Extraction
     ↓
Research Evidence
     ↓
Mistral AI
     ↓
Structured Market Research
"""

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from services.research_service import (
    get_research_service,
)
from workflows.state import StartupState


class MarketResearchOutput(BaseModel):
    """Structured output from Market Research Agent."""

    target_customers: list[str] = Field(
        description=(
            "Primary customer segments for the startup."
        )
    )

    customer_pain_points: list[str] = Field(
        description=(
            "Major customer problems and unmet needs."
        )
    )

    market_demand: str = Field(
        description=(
            "Evidence-based assessment of market demand."
        )
    )

    market_size_estimate: str = Field(
        description=(
            "Estimated market size with assumptions."
        )
    )

    growth_potential: str = Field(
        description=(
            "Assessment of future market growth."
        )
    )

    market_trends: list[str] = Field(
        description=(
            "Important market trends."
        )
    )

    opportunities: list[str] = Field(
        description=(
            "Potential market opportunities."
        )
    )

    market_risks: list[str] = Field(
        description=(
            "Important market risks."
        )
    )

    research_summary: str = Field(
        description=(
            "Overall market research summary."
        )
    )

    key_sources: list[str] = Field(
        description=(
            "URLs of the most important sources used "
            "for the analysis."
        )
    )


def _build_research_queries(
    state: StartupState,
) -> list[str]:
    """
    Build targeted search queries from the
    startup information.
    """

    startup_name = state.get(
        "startup_name",
        "",
    )

    description = state.get(
        "description",
        "",
    )

    industry = state.get(
        "industry"
    ) or ""

    target_market = state.get(
        "target_market"
    ) or ""

    return [
        f"{startup_name} market size {industry}",
        f"{description} market size",
        f"{target_market} customer demand {industry}",
        f"{industry} market trends",
        f"{description} customer pain points",
        f"{industry} growth forecast",
    ]


async def market_research_node(
    state: StartupState,
) -> dict:
    """
    Performs external web research and then
    uses Mistral AI to analyze the collected evidence.
    """

   #Build search queary

    queries = _build_research_queries(state)

   #collect web Evidence

    research_service = get_research_service()

    sources = await research_service.research(
        queries=queries,
        max_results_per_query=3,
    )

    # prepare evidance for mistral

    evidence_parts: list[str] = []

    for index, source in enumerate(
        sources,
        start=1,
    ):
        evidence_parts.append(
            f"""
SOURCE {index}

Title:
{source.title}

URL:
{source.url}

Search Snippet:
{source.snippet}

Extracted Content:
{source.content}
"""
        )

    research_evidence = "\n".join(
        evidence_parts
    )

    # Prevent excessively large prompts.
    research_evidence = research_evidence[:50000]

    # AI analysis..

    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an expert market research analyst.

You are working inside IDEON, an AI startup
analysis platform.

You have been provided with web research
collected specifically for the startup.

Your job is to reason over the evidence and
produce an evidence-based market analysis.

IMPORTANT RULES:

1. Prefer information from the provided sources.
2. Do not invent statistics.
3. Do not treat unsupported claims as facts.
4. Clearly identify assumptions.
5. Consider source quality and relevance.
6. If sources disagree, mention the uncertainty.
7. Return the requested structured format.
""",
            ),
            (
                "user",
                """
Analyze the following startup.

STARTUP NAME:
{startup_name}

DESCRIPTION:
{description}

INDUSTRY:
{industry}

TARGET MARKET:
{target_market}

ADDITIONAL INFORMATION:
{additional_info}


IDEA VALIDATION:
{idea_validation}


WEB RESEARCH EVIDENCE:
{research_evidence}


Based on the startup information and
the collected evidence, produce a detailed
market research report.
""",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(
        MarketResearchOutput
    )

    result = await chain.ainvoke(
        {
            "startup_name": state.get(
                "startup_name"
            ),
            "description": state.get(
                "description"
            ),
            "industry": (
                state.get("industry")
                or "Not specified"
            ),
            "target_market": (
                state.get("target_market")
                or "Not specified"
            ),
            "additional_info": (
                state.get("additional_info")
                or "None"
            ),
            "idea_validation": (
                state.get("idea_validation")
                or {}
            ),
            "research_evidence": research_evidence,
        }
    )

    # return to langgraph state..

    return {
        "current_agent": "Market Research",
        "progress_percentage": 35,
        "market_research": result.model_dump(),
    }