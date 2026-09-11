import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResearchJob(Base):
    __tablename__ = "research_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic = Column(String(500), nullable=False)
    research_type = Column(String(50), default="standard")
    depth = Column(String(20), default="standard")
    date_range = Column(String(50), default="all_time")
    source_preferences = Column(JSONB, nullable=True)
    status = Column(String(30), default="CREATED", index=True)
    progress = Column(Integer, default=0)
    current_agent = Column(String(100), nullable=True)
    current_task = Column(String(255), nullable=True)
    error_message = Column(Text, nullable=True)

    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="research_jobs")
    sources = relationship("ResearchSource", back_populates="research_job", cascade="all, delete-orphan")
    findings = relationship("ResearchFinding", back_populates="research_job", cascade="all, delete-orphan")
    report = relationship("ResearchReport", back_populates="research_job", uselist=False, cascade="all, delete-orphan")
    executions = relationship("AgentExecution", back_populates="research_job", cascade="all, delete-orphan")
