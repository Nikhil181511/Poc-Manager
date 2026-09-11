from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.research import ResearchJobCreate, ResearchJobResponse

router = APIRouter()

@router.post("", response_model=ResearchJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_research_job(job_in: ResearchJobCreate, db: AsyncSession = Depends(get_db)):
    # Module 2 (Your Role): Dispatch CrewAI research job to Celery worker
    pass

@router.get("/{research_id}/progress")
async def get_research_progress(research_id: UUID, db: AsyncSession = Depends(get_db)):
    # Module 2 (Your Role): Return real-time progress and agent timeline
    return {
        "research_id": research_id,
        "status": "PLANNING",
        "progress": 20,
        "current_agent": "Research Planning Agent",
        "current_task": "Formulating sub-questions and search strategy",
        "sources_count": 0,
        "findings_count": 0
    }
