"""
Web scraping service for IDEON.

Responsible for fetching allowed web pages and
extracting readable text from HTML.

Used by:
    - services.research_service
"""

from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup


@dataclass
class ScrapedPage:
    """Represents extracted content from a web page."""

    url: str
    title: str
    content: str


class ScraperService:
    """Handles web page extraction."""

    def __init__(self) -> None:
        self.timeout = 15.0

        self.headers = {
            "User-Agent": (
                "IDEON Research Bot/1.0 "
                "(research application)"
            )
        }

    async def scrape(
        self,
        url: str,
    ) -> ScrapedPage | None:
        """
        Fetch and extract readable text from a web page.

        Returns None if the page cannot be fetched
        or parsed.
        """

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
                headers=self.headers,
            ) as client:

                response = await client.get(url)

                response.raise_for_status()

        except httpx.HTTPError:
            return None

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        # Remove unnecessary HTML elements.
        
        for element in soup(
            [
                "script",
                "style",
                "nav",
                "footer",
                "header",
                "aside",
            ]
        ):
            element.decompose()

        title = (
            soup.title.get_text(strip=True)
            if soup.title
            else ""
        )

        content = soup.get_text(
            separator=" ",
            strip=True,
        )

        # Avoid sending extremely large pages
        # directly to the LLM.
        content = content[:15000]

        if not content:
            return None

        return ScrapedPage(
            url=url,
            title=title,
            content=content,
        )


def get_scraper_service() -> ScraperService:
    """Return a ScraperService instance."""

    return ScraperService()