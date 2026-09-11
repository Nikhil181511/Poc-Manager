import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class POCDocument(Base):
    __tablename__ = "poc_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    poc_id = Column(UUID(as_uuid=True), ForeignKey("pocs.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_url = Column(String(1024), nullable=False)
    version = Column(Integer, default=1)
    description = Column(String(500), nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    processing_status = Column(String(30), default="UPLOADED")
    indexing_status = Column(String(30), default="NOT_INDEXED")
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    poc = relationship("POC", back_populates="documents")
