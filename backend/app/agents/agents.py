"""
Module 2: CrewAI Agent Definitions
Contains the 5 specialized research agents:
1. Planning Agent (Research Strategist)
2. Web Research Agent (Internet Research Specialist)
3. Technical Analysis Agent (Senior Research Analyst)
4. Fact-Checking Agent (Research Quality Reviewer)
5. Report Generation Agent (Technical Report Writer)
"""

def get_research_agents(llm=None):
    # Module 2 Lead (You): Instantiate and configure the 5 CrewAI agents with tools
    return {
        "planner": None,
        "searcher": None,
        "analyst": None,
        "fact_checker": None,
        "writer": None
    }
