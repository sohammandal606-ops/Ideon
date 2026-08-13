import os

from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()


def get_llm() -> ChatMistralAI:
    api_key = os.getenv("MISTRAL_API_KEY")

    if not api_key:
        raise ValueError(
            "MISTRAL_API_KEY is not configured."
        )

    return ChatMistralAI(
        model=os.getenv(
            "MISTRAL_MODEL",
            "mistral-large-latest"
        ),
        temperature=float(
            os.getenv("MISTRAL_TEMPERATURE", "0.2")
        ),
        max_retries=3,
        api_key=api_key,
    )