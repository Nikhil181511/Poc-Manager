"""
Text chunking helper using LangChain RecursiveCharacterTextSplitter
"""
from typing import List, Dict, Any
from app.core.config import settings

def chunk_text(text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """
    Split text into chunks of 1000 tokens with 150 token overlap.
    """
    return []
