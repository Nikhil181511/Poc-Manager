from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class POCDocumentResponse(BaseModel):
    id: UUID
    poc_id: UUID
    file_name: str
    file_type: str
    file_size: int
    storage_url: str
    version: int
    description: Optional[str] = None
    uploaded_by: UUID
    processing_status: str
    indexing_status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
