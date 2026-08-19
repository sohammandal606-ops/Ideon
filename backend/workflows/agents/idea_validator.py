from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from services.llm_service import get_llm
from workflows.state import StartupState


class IdeaValidationOutput(BaseModel):
    is_valid: bool = Field(
        description="Whether the startup idea makes logical sense "
        "and solves a real problem."
    )
    strengths: list[str] = Field(description="List of core strengths of the idea.")
    weaknesses: list[str] = Field(
        description="List of potential weaknesses or fatal flaws."
    )
    score: int = Field(
        description="A score from 1 to 100 on the overall viability of the idea."
    )
    feedback: str = Field(description="Detailed constructive feedback for the founder.")


async def idea_validator_node(state: StartupState) -> dict:
    """
    Analyzes the startup idea and validates its core assumptions.
    """
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert venture capitalist and startup advisor. "
                "Your job is to brutally but constructively validate a startup idea.",
            ),
            (
                "user",
                "Please validate the following startup idea.\n\n"
                "Name: {startup_name}\n"
                "Description: {description}\n"
                "Industry: {industry}\n"
                "Target Market: {target_market}\n"
                "Additional Info: {additional_info}\n\n"
                "Analyze the problem it solves, its potential viability, "
                "strengths, and weaknesses.",
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(IdeaValidationOutput)

    result = await chain.ainvoke(
        {
            "startup_name": state.get("startup_name"),
            "description": state.get("description"),
            "industry": state.get("industry") or "Not specified",
            "target_market": state.get("target_market") or "Not specified",
            "additional_info": state.get("additional_info") or "None",
        }
    )

    return {
        "current_agent": "Idea Validator",
        "progress_percentage": 20,
        "idea_validation": result.model_dump(),
    }
    

