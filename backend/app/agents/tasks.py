"""
Module 2: CrewAI Research Tasks
Defines the sequential workflow tasks:
1. create_research_plan_task
2. discover_sources_task
3. analyze_information_task
4. validate_findings_task
5. generate_report_task
"""

from typing import List, Dict, Any, Optional
from crewai import Task, Agent

def create_research_tasks(
    agents: Dict[str, Agent],
    topic: str,
    depth: str = "standard",
    source_preferences: Optional[List[str]] = None
) -> List[Task]:
    """
    Constructs the 5 sequential CrewAI tasks for the research workflow.
    """
    planner = agents["planner"]
    searcher = agents["searcher"]
    analyst = agents["analyst"]
    fact_checker = agents["fact_checker"]
    writer = agents["writer"]

    prefs_str = ", ".join(source_preferences) if source_preferences else "official documentation, GitHub repos, and technical benchmarks"

    # Task 1: Research Strategy & Planning
    task_plan = Task(
        description=(
            f"Analyze the research topic: '{topic}'.\n"
            f"Research Depth: {depth}.\n"
            "Formulate:\n"
            "1. Core research objectives and scope.\n"
            "2. 4-6 specific technical questions that must be answered.\n"
            "3. 6-8 targeted search queries for the discovery agent to execute on the web.\n"
            f"Focus on {prefs_str}."
        ),
        expected_output="A structured research plan including key technical questions, evaluation criteria, and search queries.",
        agent=planner
    )

    # Task 2: Web & Source Discovery
    task_search = Task(
        description=(
            f"Using the search queries from the research plan, search the internet for topic: '{topic}'.\n"
            "Discover at least 5-8 high-quality authoritative sources (official docs, GitHub repos, engineering blogs).\n"
            "Collect for each source: Title, URL, Domain, Type (official docs, github, blog), and brief summary.\n"
            "Filter out duplicate or low-signal websites."
        ),
        expected_output="A curated list of 5-8 verified technical source URLs with metadata, summaries, and domain classifications.",
        agent=searcher,
        context=[task_plan]
    )

    # Task 3: Information Extraction & Technical Analysis
    task_analyze = Task(
        description=(
            "Deeply analyze the discovered sources. Use the scrape tool to read full technical content where needed.\n"
            "Extract concrete technical facts, architecture trade-offs, performance numbers, code snippets, limitations, "
            "and feature comparison matrices answering all questions from the research plan."
        ),
        expected_output="Detailed technical findings organized by sub-question, with comparison tables, pros/cons, and evidence snippets.",
        agent=analyst,
        context=[task_plan, task_search]
    )

    # Task 4: Fact-Checking & Evidence Validation
    task_validate = Task(
        description=(
            "Audit all extracted technical findings against the discovered sources.\n"
            "1. Verify that every major technical claim is backed by a specific source URL.\n"
            "2. Tag any uncertain, conflicting, or outdated claims.\n"
            "3. Assign a confidence score (0.0 - 1.0) to each key finding.\n"
            "4. Produce a validated claim-to-source mapping."
        ),
        expected_output="A verified findings audit report with confidence ratings, source mappings, and highlighted uncertainties.",
        agent=fact_checker,
        context=[task_search, task_analyze]
    )

    # Task 5: 17-Section Research Report Generation
    task_report = Task(
        description=(
            f"Synthesize the validated findings into a professional, publication-ready Markdown research report on '{topic}'.\n"
            "The report MUST follow the 17-section enterprise format:\n"
            "1. Report Title\n"
            "2. Executive Summary\n"
            "3. Research Objective\n"
            "4. Scope and Methodology\n"
            "5. Background\n"
            "6. Key Concepts\n"
            "7. Current Technology Landscape\n"
            "8. Main Findings\n"
            "9. Technical Analysis (with code or architectural patterns)\n"
            "10. Comparison of Alternatives (with Markdown table)\n"
            "11. Benefits & Advantages\n"
            "12. Limitations & Challenges\n"
            "13. Security & Operational Risks\n"
            "14. Implementation & Production Considerations\n"
            "15. Strategic Recommendations\n"
            "16. Conclusion\n"
            "17. Sources and References (Numbered markdown links)\n\n"
            "Ensure the tone is objective, technical, and executive-ready."
        ),
        expected_output="A complete, highly detailed 17-section Markdown research report with tables, verified findings, and citations.",
        agent=writer,
        context=[task_plan, task_search, task_analyze, task_validate]
    )

    return [task_plan, task_search, task_analyze, task_validate, task_report]
