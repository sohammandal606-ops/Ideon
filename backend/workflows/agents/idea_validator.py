from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel, Field

from core.config import settings
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
    api_key = (
        settings.MISTRAL_API_KEY_IDEA_VALIDATOR.get_secret_value()
        if settings.MISTRAL_API_KEY_IDEA_VALIDATOR
        else (
            settings.MISTRAL_API_KEY.get_secret_value()
            if settings.MISTRAL_API_KEY
            else None
        )
    )
    if not api_key:
        raise ValueError(
            "MISTRAL_API_KEY_IDEA_VALIDATOR (or MISTRAL_API_KEY) is not configured."
        )

    llm = ChatMistralAI(
        model=settings.MISTRAL_MODEL_IDEA_VALIDATOR or settings.MISTRAL_MODEL,
        temperature=settings.MISTRAL_TEMPERATURE_IDEA_VALIDATOR
        if settings.MISTRAL_TEMPERATURE_IDEA_VALIDATOR is not None
        else settings.MISTRAL_TEMPERATURE,
        max_retries=3,
        api_key=api_key,
    )

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
