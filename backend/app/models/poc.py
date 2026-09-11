import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class POC(Base):
    __tablename__ = "pocs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    poc_code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    short_description = Column(String(500), nullable=False)
    detailed_description = Column(Text, nullable=False)
    business_problem = Column(Text, nullable=False)
    technical_problem = Column(Text, nullable=False)
    objective = Column(Text, nullable=False)
    scope = Column(Text, nullable=False)
    out_of_scope = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    priority = Column(String(20), nullable=False, default="Medium")
    status = Column(String(30), nullable=False, default="Draft", index=True)
    
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)

    technology_stack = Column(JSONB, nullable=False, default=list)
    architecture_details = Column(Text, nullable=True)
    evaluation_criteria = Column(JSONB, nullable=True)
    test_results = Column(Text, nullable=True)
    performance_results = Column(Text, nullable=True)
    cost_estimation = Column(Text, nullable=True)
    scalability_findings = Column(Text, nullable=True)
    security_findings = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    outcome = Column(String(50), nullable=True)
    production_readiness = Column(String(50), nullable=True)
    lessons_learned = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)

    start_date = Column(Date, nullable=True)
    expected_end_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    is_archived = Column(Boolean, default=False, index=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="pocs")
    team = relationship("Team", back_populates="pocs")
    documents = relationship("POCDocument", back_populates="poc", cascade="all, delete-orphan")
