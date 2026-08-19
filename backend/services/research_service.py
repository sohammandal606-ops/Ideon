"""
Research service for IDEON.

Combines web search and web extraction to create
clean research evidence for AI agents.

Used by:
    - workflows.agents.market_research
    - workflows.agents.competitor_analysis
"""

from dataclasses import dataclass

from services.scraper_service import (
    ScraperService,
    get_scraper_service,
)

from services.search_service import (
    SearchResult,
    SearchService,
    get_search_service,
)


@dataclass
class ResearchSource:
    """Clean research evidence."""

    title: str
    url: str
    content: str
    snippet: str


class ResearchService:
    """Coordinates web search and page extraction."""

    def __init__(
        self,
        search_service: SearchService | None = None,
        scraper_service: ScraperService | None = None,
    ) -> None:

        self.search_service = (
            search_service
            or get_search_service()
        )

        self.scraper_service = (
            scraper_service
            or get_scraper_service()
        )

    async def research(
        self,
        queries: list[str],
        max_results_per_query: int = 3,
    ) -> list[ResearchSource]:
        """
        Execute multiple research queries and
        extract useful information from the results.
        """

        sources: list[ResearchSource] = []

        seen_urls: set[str] = set()

        for query in queries:

            results = await self.search_service.search(
                query=query,
                max_results=max_results_per_query,
            )

            for result in results:

                if result.url in seen_urls:
                    continue

                seen_urls.add(result.url)

                page = await self.scraper_service.scrape(
                    result.url
                )

                if page is None:
                    continue

                sources.append(
                    ResearchSource(
                        title=page.title
                        or result.title,
                        url=page.url,
                        content=page.content,
                        snippet=result.snippet,
                    )
                )

        return sources


def get_research_service() -> ResearchService:
    """Return a ResearchService instance."""

    return ResearchService()