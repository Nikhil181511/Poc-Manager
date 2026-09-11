from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from app.schemas.research import ResearchSourceResponse, ResearchFindingResponse

class ResearchReportResponse(BaseModel):
    id: UUID
    research_job_id: UUID
    title: str
    executive_summary: str
    content_markdown: str
    report_type: str
    status: str
    version: int
    created_by: UUID
    saved_to_knowledge_base: bool
    sources: Optional[List[ResearchSourceResponse]] = []
    findings: Optional[List[ResearchFindingResponse]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
