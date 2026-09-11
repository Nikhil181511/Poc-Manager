from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.chat import ConversationCreate, ConversationResponse, ChatMessageCreate

router = APIRouter()

@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(conv_in: ConversationCreate, db: AsyncSession = Depends(get_db)):
    # Lead 3: Create conversation session
    pass

@router.post("/conversations/{conversation_id}/messages")
async def send_chat_message(
    conversation_id: UUID,
    msg_in: ChatMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    # Lead 3: Query pgvector, invoke LangChain RAG chain, stream SSE response with citations
    pass
