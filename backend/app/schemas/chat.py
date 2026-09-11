from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"
    mode: str = "ORGANIZATION"
    poc_id: Optional[UUID] = None
    document_id: Optional[UUID] = None
    category: Optional[str] = None

class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    mode: str
    poc_id: Optional[UUID] = None
    document_id: Optional[UUID] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    content: str
    stream: bool = True

class ChatMessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    retrieved_sources: Optional[Any] = None
    token_usage: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True
