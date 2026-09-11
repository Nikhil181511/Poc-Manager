from typing import Optional, List, Any
from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel

class POCCreate(BaseModel):
    poc_code: str
    title: str
    short_description: str
    detailed_description: str
    business_problem: str
    technical_problem: str
    objective: str
    scope: str
    out_of_scope: Optional[str] = None
    category: str
    priority: str = "Medium"
    status: str = "Draft"
    team_id: UUID
    technology_stack: List[str] = []
    architecture_details: Optional[str] = None
    evaluation_criteria: Optional[Any] = None
    test_results: Optional[str] = None
    performance_results: Optional[str] = None
    cost_estimation: Optional[str] = None
    scalability_findings: Optional[str] = None
    security_findings: Optional[str] = None
    limitations: Optional[str] = None
    risks: Optional[str] = None
    recommendations: Optional[str] = None
    outcome: Optional[str] = None
    production_readiness: Optional[str] = None
    lessons_learned: Optional[str] = None
    start_date: Optional[date] = None
    expected_end_date: Optional[date] = None

class POCUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    technology_stack: Optional[List[str]] = None
    architecture_details: Optional[str] = None
    test_results: Optional[str] = None
    performance_results: Optional[str] = None
    limitations: Optional[str] = None
    risks: Optional[str] = None
    recommendations: Optional[str] = None
    outcome: Optional[str] = None
    production_readiness: Optional[str] = None
    lessons_learned: Optional[str] = None
    completed_date: Optional[date] = None

class POCResponse(POCCreate):
    id: UUID
    owner_id: UUID
    ai_summary: Optional[str] = None
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class POCListResponse(BaseModel):
    total: int
    items: List[POCResponse]
