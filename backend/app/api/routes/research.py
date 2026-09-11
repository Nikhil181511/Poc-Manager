import uuid
import json
import asyncio
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.research import ResearchJobCreate, ResearchJobResponse
from app.services.research_service import ResearchService, job_event_queues

router = APIRouter()

# Default dev user UUID when running locally before auth is populated
DEV_USER_ID = uuid.UUID("11111111-1111-1111-1111-111111111111")

@router.post("", response_model=ResearchJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_research_job(job_in: ResearchJobCreate, db: AsyncSession = Depends(get_db)):
    """
    Submits a research topic and dispatches the autonomous CrewAI research crew.
    """
    job = await ResearchService.create_research_job(
        db=db,
        topic=job_in.topic,
        user_id=DEV_USER_ID,
        research_type=job_in.research_type,
        depth=job_in.depth,
        date_range=job_in.date_range,
        source_preferences=job_in.source_preferences
    )
    return job

@router.get("/{research_id}", response_model=ResearchJobResponse)
async def get_research_job(research_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Returns current status and metadata of a research job.
    """
    job = await ResearchService.get_job(db, research_id)
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found.")
    return job

@router.get("/{research_id}/progress")
async def get_research_progress(research_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Returns the real-time progress percentage, current active agent, and task description.
    """
    job = await ResearchService.get_job(db, research_id)
    if not job:
        raise HTTPException(status_code=404, detail="Research job not found.")
    
    return {
        "research_id": job.id,
        "status": job.status,
        "progress": job.progress,
        "current_agent": job.current_agent,
        "current_task": job.current_task,
        "started_at": job.started_at,
        "completed_at": job.completed_at
    }

@router.get("/{research_id}/events")
async def stream_research_events(research_id: uuid.UUID):
    """
    Server-Sent Events (SSE) streaming endpoint that pushes live agent transitions and logs.
    """
    job_id_str = str(research_id)
    queue = job_event_queues.get(job_id_str)

    async def event_generator():
        if not queue:
            # Yield initial status if job already done or queue missing
            yield f"data: {json.dumps({'message': 'Connected to research stream.'})}\n\n"
            return

        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=20.0)
                yield f"data: {json.dumps(event)}\n\n"
                if event.get("status") in ["COMPLETED", "FAILED", "CANCELLED"]:
                    break
            except asyncio.TimeoutError:
                # Keep-alive heartbeat ping
                yield ": keepalive\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
