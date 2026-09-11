"""
Module 2: CrewAI Agent Definitions
Implements the 5 specialized autonomous research agents:
1. Research Planning Agent (Research Strategist)
2. Web Research & Source Discovery Agent (Internet Research Specialist)
3. Information Extraction & Technical Analysis Agent (Senior Research Analyst)
4. Fact-Checking & Validation Agent (Research Quality Reviewer)
5. Report Generation Agent (Technical Report Writer)
"""

import os
from typing import Dict, Any, Optional
from crewai import Agent
from langchain_community.tools import Tool
from app.agents.tools import search_web_tool, scrape_url_tool, github_metadata_tool
from app.core.config import settings

def get_configured_llm():
    """Returns the configured LLM based on environment settings (Google Gemini or OpenAI)."""
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "google" and settings.GOOGLE_API_KEY:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.2
        )
    elif provider == "openai" and settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o-mini",
            api_key=settings.OPENAI_API_KEY,
            temperature=0.2
        )
    else:
        # Default fallback / mockable or standard OpenAI if key is in standard env
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
        except Exception:
            return None

def create_agent_tools() -> list:
    """Wrap Python utility functions into CrewAI / LangChain Tool instances."""
    return [
        Tool(
            name="search_web",
            func=search_web_tool,
            description="Searches the internet for technical articles, documentation, benchmarks, and libraries. Input should be a specific search query."
        ),
        Tool(
            name="scrape_webpage",
            func=scrape_url_tool,
            description="Scrapes and extracts clean readable text from a URL. Input must be a valid http/https URL."
        ),
        Tool(
            name="get_github_metadata",
            func=github_metadata_tool,
            description="Retrieves metadata, stars, language, and overview for a GitHub repository. Input must be a GitHub repository URL."
        )
    ]

def get_research_agents(llm=None) -> Dict[str, Agent]:
    """
    Instantiates and returns the 5 CrewAI agents equipped with tools and domain backstories.
    """
    if llm is None:
        llm = get_configured_llm()

    tools = create_agent_tools()
    search_and_scrape_tools = [tools[0], tools[1], tools[2]]

    # 1. Research Planning Agent
    planner = Agent(
        role="Technical Research Strategist",
        goal="Deconstruct the user's research topic into targeted sub-questions, technical evaluation criteria, and search queries.",
        backstory=(
            "You are a seasoned Principal Architect and Research Director. You excel at taking broad technical "
            "topics and breaking them down into precise, answerable technical questions, performance criteria, "
            "and targeted search queries to uncover state-of-the-art developments."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 2. Web Research & Source Discovery Agent
    searcher = Agent(
        role="Internet & Documentation Research Specialist",
        goal="Discover authoritative technical sources, official documentation, GitHub repositories, and benchmarks on the web.",
        backstory=(
            "You are an expert technical intelligence researcher. You know how to search effectively across "
            "official documentation, technical blogs, GitHub repositories, and benchmarks, filtering out marketing fluff "
            "and collecting high-signal URLs and sources."
        ),
        tools=search_and_scrape_tools,
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 3. Information Extraction & Technical Analysis Agent
    analyst = Agent(
        role="Senior Technical Research Analyst",
        goal="Deeply analyze discovered sources, extract architectural tradeoffs, performance metrics, limitations, and use cases.",
        backstory=(
            "You are a Senior Software Systems Analyst. You read deeply into technical articles and documentation, "
            "extracting architecture patterns, comparative trade-offs, code considerations, hardware/memory overhead, "
            "and concrete technical facts."
        ),
        tools=[tools[1]], # Scrape tool for deep-reading
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 4. Fact-Checking & Validation Agent
    fact_checker = Agent(
        role="Research Quality and Validation Reviewer",
        goal="Verify that all extracted claims and performance numbers are backed by cited source URLs and tag any unconfirmed claims.",
        backstory=(
            "You are a meticulous technical editor and auditor. You cross-reference claims against source text, "
            "detect hallucinations, calculate confidence scores (0.0 - 1.0), and ensure every assertion has verifiable evidence."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    # 5. Report Generation Agent
    writer = Agent(
        role="Technical Report Writer and Architect",
        goal="Synthesize verified findings into a comprehensive, professional 17-section Markdown research report.",
        backstory=(
            "You are a world-class technical author and enterprise architect. You produce crystal-clear, beautifully formatted "
            "technical reports with executive summaries, comparison tables, actionable recommendations, and full source references."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

    return {
        "planner": planner,
        "searcher": searcher,
        "analyst": analyst,
        "fact_checker": fact_checker,
        "writer": writer
    }
