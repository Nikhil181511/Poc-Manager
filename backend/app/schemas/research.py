from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class ResearchJobCreate(BaseModel):
    topic: str
    research_type: str = "standard"
    depth: str = "standard"
    date_range: str = "all_time"
    source_preferences: Optional[List[str]] = None

class ResearchJobResponse(BaseModel):
    id: UUID
    user_id: UUID
    topic: str
    research_type: str
    depth: str
    date_range: str
    source_preferences: Optional[List[str]] = None
    status: str
    progress: int
    current_agent: Optional[str] = None
    current_task: Optional[str] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ResearchSourceResponse(BaseModel):
    id: UUID
    title: str
    url: str
    domain: str
    source_type: str
    published_date: Optional[str] = None
    relevance_score: float
    summary: Optional[str] = None
    verification_status: str

    class Config:
        from_attributes = True

class ResearchFindingResponse(BaseModel):
    id: UUID
    question: str
    finding: str
    evidence: str
    source_ids: List[Any]
    confidence: float
    validation_status: str

    class Config:
        from_attributes = True
