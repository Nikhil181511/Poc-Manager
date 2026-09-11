import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResearchSource(Base):
    __tablename__ = "research_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    research_job_id = Column(UUID(as_uuid=True), ForeignKey("research_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    url = Column(String(2048), nullable=False)
    domain = Column(String(255), nullable=False)
    source_type = Column(String(50), default="web")
    published_date = Column(String(50), nullable=True)
    retrieved_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    relevance_score = Column(Float, default=1.0)
    summary = Column(Text, nullable=True)
    verification_status = Column(String(30), default="UNVERIFIED")

    research_job = relationship("ResearchJob", back_populates="sources")
