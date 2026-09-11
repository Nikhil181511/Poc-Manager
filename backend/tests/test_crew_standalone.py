"""
Standalone Test Script for Module 2: Multi-Agent Internet Research
Runs the 5 CrewAI agents directly in terminal to test web search, analysis, fact-checking, and report generation.
"""

import os
import sys

# Ensure backend root is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv()

from app.agents.crew import run_research_crew

def main():
    topic = "Compare LangChain, LlamaIndex, and Haystack for production RAG in 2026"
    print("\n" + "="*80)
    print(f"🚀 STARTING MULTI-AGENT RESEARCH CREW TEST")
    print(f"📌 Topic: {topic}")
    print("="*80 + "\n")

    def print_progress(event):
        agent = event.get("agent", "Agent")
        status = event.get("status", "RUNNING")
        progress = event.get("progress", 0)
        msg = event.get("message", "")
        print(f"[{progress}%] [{agent}] ({status}): {msg}")

    result = run_research_crew(
        topic=topic,
        depth="standard",
        source_preferences=["official_docs", "github_repo"],
        progress_callback=print_progress
    )

    print("\n" + "="*80)
    print("✅ RESEARCH WORKFLOW COMPLETED SUCCESSFULLY!")
    print("="*80)
    print(f"\n📑 Title: {result.get('title')}")
    print(f"\n💡 Executive Summary:\n{result.get('executive_summary')}")
    print(f"\n🌐 Discovered Sources ({len(result.get('sources', []))}):")
    for s in result.get('sources', []):
        print(f"  - [{s.get('verification_status')}] {s.get('title')}: {s.get('url')}")
    
    print(f"\n📝 Report Preview (First 800 chars):\n")
    print(result.get("content_markdown", "")[:800] + "\n...")

if __name__ == "__main__":
    main()
