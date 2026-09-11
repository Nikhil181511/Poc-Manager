from fastapi import APIRouter

router = APIRouter()

@router.get("")
async def get_settings():
    return {"llm_provider": "google", "embedding_provider": "google"}
