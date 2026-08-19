"""
Business Model Agent.

This agent analyzes the startup's market research and
competitor analysis and creates a suitable business model.

Workflow:

Idea Validator
      ↓
Market Research ──────┐
                      │
Competitor Analysis ──┤
                      ↓
              Business Model Agent
                      ↓
             StartupState
                      ↓
             business_model

Depends on:
    services.llm_service
    workflows.state

Used by:
    workflows.startup_workflow
"""

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


class RevenueStream(BaseModel):
    """Represents one possible revenue stream."""

    name: str = Field(
        description="Name of the revenue stream."
    )

    description: str = Field(
        description="How this revenue stream works."
    )

    pricing_strategy: str = Field(
        description="Suggested pricing strategy."
    )

    target_customers: list[str] = Field(
        description="Customer segments that would pay for this."
    )


class BusinessModelOutput(BaseModel):
    """Structured output from the Business Model Agent."""

    recommended_business_model: str = Field(
        description=(
            "The primary business model recommended for "
            "the startup."
        )
    )

    value_proposition: str = Field(
        description=(
            "The core value proposition of the startup."
        )
    )

    customer_segments: list[str] = Field(
        description=(
            "The most important customer segments."
        )
    )

    revenue_streams: list[RevenueStream] = Field(
        description=(
            "Potential ways the startup can generate revenue."
        )
    )

    primary_revenue_stream: str = Field(
        description=(
            "The single most promising revenue stream."
        )
    )

    pricing_strategy: str = Field(
        description=(
            "Recommended pricing strategy and reasoning."
        )
    )

    cost_structure: list[str] = Field(
        description=(
            "Major costs required to operate the startup."
        )
    )

    key_resources: list[str] = Field(
        description=(
            "Important resources required to operate "
            "the business."
        )
    )

    key_activities: list[str] = Field(
        description=(
            "Important activities required to deliver "
            "the product or service."
        )
    )

    competitive_advantage: list[str] = Field(
        description=(
            "Potential sustainable advantages over competitors."
        )
    )

    risks: list[str] = Field(
        description=(
            "Major risks associated with the proposed "
            "business model."
        )
    )

    scalability: str = Field(
        description=(
            "How the business model can scale."
        )
    )

    recommendation: str = Field(
        description=(
            "Final recommendation for the founder."
        )
    )


async def business_model_node(
    state: StartupState,
) -> dict:
    """
    Generates a business model using the results from
    Market Research and Competitor Analysis.
    """

  
    # STEP 1 — Get Mistral LLM
  

    llm = get_llm()

    # STEP 2 — Create prompt
  

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """
You are an expert startup strategist, business
model consultant, and venture advisor.

You are working inside IDEON, an AI-powered startup
analysis platform.

Your job is to design a realistic and sustainable
business model for a startup.

You must use:

1. The original startup idea.
2. The Idea Validation result.
3. Market Research.
4. Competitor Analysis.

IMPORTANT RULES:

- Do not blindly accept the startup idea.
- Base your recommendations on the provided research.
- Do not invent market facts.
- Do not invent competitor information.
- Choose a realistic monetization strategy.
- Consider customer willingness to pay.
- Consider competitor pricing and positioning.
- Consider operational costs.
- Consider scalability.
- Clearly explain your recommendations.
- Focus on a practical MVP-stage business model.
""",
            ),
            (
                "user",
                """
Create a business model for the following startup.


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


{competitor_analysis}




Based on all the information above:

1. Identify the best business model.
2. Define the startup's value proposition.
3. Identify the most important customer segments.
4. Identify possible revenue streams.
5. Select the primary revenue stream.
6. Recommend pricing.
7. Identify major costs.
8. Identify key resources.
9. Identify key activities.
10. Identify competitive advantages.
11. Identify business-model risks.
12. Explain scalability.
13. Give a final recommendation to the founder.

The recommendation must be practical for an early-stage
startup and should not depend on unrealistic assumptions.
""",
            ),
        ]
    )

    
    # STEP 3 — Structured Mistral output


    chain = prompt | llm.with_structured_output(
        BusinessModelOutput
    )

    
    # STEP 4 — Run the LLM
   

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
            "competitor_analysis": (
                state.get("competitor_analysis")
                or {}
            ),
        }
    )

   
    # STEP 5 — Update LangGraph State
    

    return {
        "current_agent": "Business Model",
        "progress_percentage": 50,
        "business_model": result.model_dump(),
    }