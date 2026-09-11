import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResearchFinding(Base):
    __tablename__ = "research_findings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    research_job_id = Column(UUID(as_uuid=True), ForeignKey("research_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    finding = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    source_ids = Column(JSONB, nullable=False, default=list)
    confidence = Column(Float, default=0.8)
    validation_status = Column(String(30), default="VALIDATED")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    research_job = relationship("ResearchJob", back_populates="findings")
