"""
Web search service for IDEON.

This service is responsible for discovering relevant
web sources for AI research agents.

Used by:
    - services.research_service
    - workflows.agents.market_research
    - workflows.agents.competitor_analysis
"""

from dataclasses import dataclass


@dataclass
class SearchResult:
    """Represents one web search result."""

    title: str
    url: str
    snippet: str


class SearchService:
    """Handles web search operations."""

    async def search(
        self,
        query: str,
        max_results: int = 5,
    ) -> list[SearchResult]:
        """
        Search the web for relevant sources.

        Replace the implementation below with your
        chosen search API.
        """

        return []


def get_search_service() -> SearchService:
    """Return a SearchService instance."""

    return SearchService()