"""
Module 2: Research Service
Handles research job lifecycle, DB mutations, Celery/async execution, and event streaming.
"""

import uuid
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.research_job import ResearchJob
from app.models.research_source import ResearchSource
from app.models.research_finding import ResearchFinding
from app.models.research_report import ResearchReport
from app.models.agent_execution import AgentExecution
from app.agents.crew import run_research_crew

logger = logging.getLogger("poc_platform.research_service")

# In-memory event stream buffer for real-time SSE updates per job
job_event_queues: Dict[str, asyncio.Queue] = {}

class ResearchService:
    @staticmethod
    async def create_research_job(
        db: AsyncSession,
        topic: str,
        user_id: uuid.UUID,
        research_type: str = "standard",
        depth: str = "standard",
        date_range: str = "all_time",
        source_preferences: Optional[List[str]] = None
    ) -> ResearchJob:
        """Creates a new research job record and initializes event queue."""
        job = ResearchJob(
            id=uuid.uuid4(),
            user_id=user_id,
            topic=topic,
            research_type=research_type,
            depth=depth,
            date_range=date_range,
            source_preferences=source_preferences or [],
            status="CREATED",
            progress=0,
            current_agent="Planning Agent",
            current_task="Job queued for execution",
            created_at=datetime.now(timezone.utc)
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)

        job_id_str = str(job.id)
        job_event_queues[job_id_str] = asyncio.Queue()

        # Start background async task
        asyncio.create_task(ResearchService.run_job_async(job_id_str, topic, depth, source_preferences, user_id))

        return job

    @staticmethod
    async def run_job_async(job_id: str, topic: str, depth: str, source_prefs: list, user_id: uuid.UUID):
        """Asynchronous execution runner that calls CrewAI and pushes events."""
        from app.core.database import AsyncSessionLocal
        queue = job_event_queues.get(job_id)

        async def publish_event(event: Dict[str, Any]):
            event_data = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "agent": event.get("agent"),
                "task": event.get("task"),
                "status": event.get("status"),
                "progress": event.get("progress"),
                "message": event.get("message")
            }
            if queue:
                await queue.put(event_data)
            
            # Update DB job status
            async with AsyncSessionLocal() as session:
                stmt = select(ResearchJob).where(ResearchJob.id == uuid.UUID(job_id))
                res = await session.execute(stmt)
                db_job = res.scalar_one_or_none()
                if db_job:
                    db_job.status = event.get("status", db_job.status)
                    db_job.progress = event.get("progress", db_job.progress)
                    db_job.current_agent = event.get("agent")
                    db_job.current_task = event.get("task")
                    if event.get("status") == "COMPLETED":
                        db_job.completed_at = datetime.now(timezone.utc)
                    await session.commit()

        def sync_progress_callback(event: Dict[str, Any]):
            # Bridge synchronous CrewAI callback to async event queue
            loop = asyncio.get_event_loop()
            if loop.is_running():
                asyncio.run_coroutine_threadsafe(publish_event(event), loop)

        try:
            # Run in thread executor to avoid blocking async event loop
            loop = asyncio.get_running_loop()
            result = await loop.run_in_executor(
                None,
                run_research_crew,
                topic,
                depth,
                source_prefs,
                sync_progress_callback
            )

            # Persist Report, Sources, and Findings
            async with AsyncSessionLocal() as session:
                # 1. Save Report
                report = ResearchReport(
                    id=uuid.uuid4(),
                    research_job_id=uuid.UUID(job_id),
                    title=result.get("title", f"Research: {topic}"),
                    executive_summary=result.get("executive_summary", ""),
                    content_markdown=result.get("content_markdown", ""),
                    status="FINAL",
                    created_by=user_id,
                    saved_to_knowledge_base=False
                )
                session.add(report)

                # 2. Save Sources
                for s in result.get("sources", []):
                    source_obj = ResearchSource(
                        id=uuid.uuid4(),
                        research_job_id=uuid.UUID(job_id),
                        title=s.get("title", "Untitled"),
                        url=s.get("url", ""),
                        domain=s.get("domain", "web"),
                        source_type=s.get("source_type", "web"),
                        relevance_score=s.get("relevance_score", 1.0),
                        verification_status=s.get("verification_status", "VERIFIED")
                    )
                    session.add(source_obj)

                # 3. Save Findings
                for f in result.get("findings", []):
                    finding_obj = ResearchFinding(
                        id=uuid.uuid4(),
                        research_job_id=uuid.UUID(job_id),
                        question=f.get("question", ""),
                        finding=f.get("finding", ""),
                        evidence=f.get("evidence", ""),
                        confidence=f.get("confidence", 0.9),
                        validation_status=f.get("validation_status", "VALIDATED")
                    )
                    session.add(finding_obj)

                await session.commit()

        except Exception as e:
            logger.error(f"Async research job error: {str(e)}")
            if queue:
                await queue.put({
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "agent": "System",
                    "task": "Error",
                    "status": "FAILED",
                    "progress": 0,
                    "message": f"Execution failed: {str(e)}"
                })

    @staticmethod
    async def get_job(db: AsyncSession, job_id: uuid.UUID) -> Optional[ResearchJob]:
        """Retrieves a research job by UUID."""
        stmt = select(ResearchJob).where(ResearchJob.id == job_id)
        res = await db.execute(stmt)
        return res.scalar_one_or_none()

    @staticmethod
    async def get_report_by_job_id(db: AsyncSession, job_id: uuid.UUID) -> Optional[ResearchReport]:
        """Retrieves report with related sources and findings."""
        stmt = select(ResearchReport).where(ResearchReport.research_job_id == job_id)
        res = await db.execute(stmt)
        return res.scalar_one_or_none()

    @staticmethod
    async def get_report_by_id(db: AsyncSession, report_id: uuid.UUID) -> Optional[ResearchReport]:
        """Retrieves report by report ID."""
        stmt = select(ResearchReport).where(ResearchReport.id == report_id)
        res = await db.execute(stmt)
        return res.scalar_one_or_none()
