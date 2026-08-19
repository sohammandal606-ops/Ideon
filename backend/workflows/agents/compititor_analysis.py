"""
Competitor Analysis Agent.

This agent identifies and analyzes competitors using
external web research.

Workflow:

StartupState
     ↓
Generate competitor research queries
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
Structured Competitor Analysis
     ↓
StartupState["competitor_analysis"]

Depends on:
    services.llm_service
    services.research_service
    workflows.state

Used by:
    workflows.startup_workflow
"""

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from services.research_service import get_research_service
from workflows.state import StartupState


class Competitor(BaseModel):
    """Information about an individual competitor."""

    name: str = Field(
        description="Name of the competitor."
    )

    website: str | None = Field(
        default=None,
        description="Official website of the competitor if available.",
    )

    competitor_type: str = Field(
        description=(
            "Type of competitor, such as direct, indirect, "
            "substitute, or emerging competitor."
        )
    )

    description: str = Field(
        description="Short description of what the competitor does."
    )

    target_customers: list[str] = Field(
        description="Main customer segments targeted by the competitor."
    )

    products_or_services: list[str] = Field(
        description="Main products or services offered."
    )

    strengths: list[str] = Field(
        description="Major competitive strengths."
    )

    weaknesses: list[str] = Field(
        description="Major weaknesses or limitations."
    )

    pricing: str | None = Field(
        default=None,
        description="Known pricing or pricing model."
    )


class CompetitorAnalysisOutput(BaseModel):
    """Structured output from the Competitor Analysis Agent."""

    direct_competitors: list[Competitor] = Field(
        description=(
            "Competitors offering a very similar product "
            "or solving the same core problem."
        )
    )

    indirect_competitors: list[Competitor] = Field(
        description=(
            "Companies or alternatives that solve the "
            "same customer problem differently."
        )
    )

    emerging_competitors: list[Competitor] = Field(
        description=(
            "New or emerging companies that could become "
            "important competitors."
        )
    )

    competitor_comparison: list[str] = Field(
        description=(
            "Important comparison points between the startup "
            "and its competitors."
        )
    )

    market_gaps: list[str] = Field(
        description=(
            "Unserved or underserved opportunities discovered "
            "from competitor research."
        )
    )

    differentiation_opportunities: list[str] = Field(
        description=(
            "Ways the startup could differentiate itself "
            "from existing competitors."
        )
    )

    competitive_risks: list[str] = Field(
        description=(
            "Major competitive threats and risks."
        )
    )

    competitive_summary: str = Field(
        description=(
            "Overall summary of the competitive landscape."
        )
    )

    key_sources: list[str] = Field(
        description=(
            "URLs of the most important sources used "
            "for the competitor analysis."
        )
    )


def _build_competitor_queries(
    state: StartupState,
) -> list[str]:
    """
    Generate search queries specifically for competitor research.
    """

    startup_name = state.get(
        "startup_name",
        "",
    )

    description = state.get(
        "description",
        "",
    )

    industry = (
        state.get("industry")
        or ""
    )

    target_market = (
        state.get("target_market")
        or ""
    )

    return [
        f"{description} competitors",
        f"{description} alternatives",
        f"{industry} companies {target_market}",
        f"best {industry} startups",
        f"{description} similar companies",
        f"{target_market} {industry} competitors",
        f"{startup_name} competitors",
    ]


async def competitor_analysis_node(
    state: StartupState,
) -> dict:
    """
    Performs competitor research and uses Mistral AI
    to analyze the collected evidence.
    """

    # STEP 1 — Generate competitor queries
    

    queries = _build_competitor_queries(state)

   
    # STEP 2 — Collect competitor research
   

    research_service = get_research_service()

    sources = await research_service.research(
        queries=queries,
        max_results_per_query=3,
    )

   
    # STEP 3 — Prepare evidence for Mistral
   

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

    # Prevent an unnecessarily large LLM prompt.
    research_evidence = research_evidence[:50000]

    
    # STEP 4 — Mistral competitor analysis
   

    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an expert competitive intelligence analyst
and startup strategist.

You are working inside IDEON, an AI-powered startup
analysis platform.

Your task is to identify and analyze the competitive
landscape surrounding a startup.

You have access to web research collected specifically
for this startup.

IMPORTANT RULES:

1. Use the provided research evidence.
2. Do not invent companies.
3. Do not invent pricing.
4. Do not invent statistics.
5. Clearly distinguish direct, indirect, and emerging
   competitors.
6. Prefer official company information when available.
7. If information is uncertain, say so.
8. Identify weaknesses and gaps carefully.
9. Look for opportunities where the startup can
   differentiate itself.
10. Return the result in the requested structured format.
""",
            ),
            (
                "user",
                """
Analyze the competitive landscape for this startup.



Startup Name:
{startup_name}

Description:
{description}

Industry:
{industry}

Target Market:
{target_market}

Additional Information:
{additional_info}

{idea_validation}

{market_research}


{research_evidence}


Identify the startup's direct, indirect,
and emerging competitors.

Then analyze:

- Their products
- Their target customers
- Their strengths
- Their weaknesses
- Their pricing
- Market gaps
- Differentiation opportunities
- Competitive risks

Produce an evidence-based competitive analysis.
""",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(
        CompetitorAnalysisOutput
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
            "market_research": (
                state.get("market_research")
                or {}
            ),
            "research_evidence": research_evidence,
        }
    )

    # STEP 5 — Save result into LangGraph state
    

    return {
        "current_agent": "Competitor Analysis",
        "progress_percentage": 35,
        "competitor_analysis": result.model_dump(),
    }