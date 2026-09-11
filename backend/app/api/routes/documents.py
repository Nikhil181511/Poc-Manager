from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.document import POCDocumentResponse

router = APIRouter()

@router.post("/pocs/{poc_id}/documents", response_model=POCDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    poc_id: UUID,
    file: UploadFile = File(...),
    description: str = Form(None),
    db: AsyncSession = Depends(get_db)
):
    # Lead 1 & 3: Save file, store record, queue for ingestion
    pass

@router.get("/{document_id}", response_model=POCDocumentResponse)
async def get_document(document_id: UUID, db: AsyncSession = Depends(get_db)):
    pass
