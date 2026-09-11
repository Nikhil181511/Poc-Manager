"""
Module 2: Multi-Agent Internet Research Tools
Provides search, web scraping, and GitHub extraction capabilities for CrewAI agents.
"""

import json
import logging
import httpx
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

logger = logging.getLogger("poc_platform.tools")

def search_web_tool(query: str, max_results: int = 6) -> str:
    """
    Searches the internet using DuckDuckGo and returns structured search results.
    Args:
        query: The search query string.
        max_results: Maximum number of search results to return (default: 6).
    Returns:
        JSON string containing list of results with title, url, and snippet.
    """
    logger.info(f"Executing web search for query: {query}")
    results = []
    try:
        with DDGS() as ddgs:
            raw_results = list(ddgs.text(query, max_results=max_results))
            for r in raw_results:
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", "")
                })
        return json.dumps(results, indent=2)
    except Exception as e:
        logger.error(f"Web search error: {str(e)}")
        # Fallback empty structure
        return json.dumps([{"title": "Search Error", "url": "", "snippet": f"Could not perform search: {str(e)}"}])

def scrape_url_tool(url: str, max_chars: int = 4000) -> str:
    """
    Fetches a webpage, cleans HTML tags, strips ads/scripts, and returns readable text.
    Args:
        url: The web URL to fetch.
        max_chars: Maximum characters of clean text to return.
    Returns:
        Clean plain text content of the webpage.
    """
    logger.info(f"Scraping webpage: {url}")
    if not url or not url.startswith("http"):
        return "Invalid URL provided."

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        with httpx.Client(timeout=10.0, follow_redirects=True, headers=headers) as client:
            resp = client.get(url)
            if resp.status_code != 200:
                return f"Failed to fetch page. HTTP Status: {resp.status_code}"
            
            soup = BeautifulSoup(resp.text, "html.parser")

            # Remove irrelevant tags
            for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "aside", "svg"]):
                tag.decompose()

            text = soup.get_text(separator="\n")
            # Clean up excessive blank lines
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            cleaned_text = "\n".join(lines)

            if len(cleaned_text) > max_chars:
                cleaned_text = cleaned_text[:max_chars] + "\n...[Content Truncated]"

            return cleaned_text if cleaned_text else "No readable text found on page."
    except Exception as e:
        logger.error(f"Error scraping {url}: {str(e)}")
        return f"Scraping failed: {str(e)}"

def github_metadata_tool(repo_url: str) -> str:
    """
    Extracts repository information, star count, and README summary for a GitHub repository.
    Args:
        repo_url: Full GitHub repository URL (e.g., https://github.com/owner/repo)
    Returns:
        JSON string containing repository metadata and README excerpt.
    """
    logger.info(f"Fetching GitHub metadata for: {repo_url}")
    try:
        parts = repo_url.strip("/").split("/")
        if len(parts) < 2 or "github.com" not in repo_url:
            return json.dumps({"error": "Invalid GitHub repository URL format."})

        owner = parts[-2]
        repo = parts[-1]
        api_url = f"https://api.github.com/repos/{owner}/{repo}"

        headers = {"User-Agent": "POC-Intelligence-Platform"}
        with httpx.Client(timeout=8.0, headers=headers) as client:
            resp = client.get(api_url)
            if resp.status_code == 200:
                data = resp.json()
                return json.dumps({
                    "name": data.get("name"),
                    "full_name": data.get("full_name"),
                    "description": data.get("description"),
                    "stars": data.get("stargazers_count"),
                    "forks": data.get("forks_count"),
                    "language": data.get("language"),
                    "license": data.get("license", {}).get("name") if data.get("license") else "None",
                    "updated_at": data.get("updated_at")
                }, indent=2)
            else:
                return json.dumps({"error": f"GitHub API responded with status {resp.status_code}"})
    except Exception as e:
        logger.error(f"GitHub fetch error: {str(e)}")
        return json.dumps({"error": str(e)})
