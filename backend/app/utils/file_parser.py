"""
File Parsers for PDF, DOCX, PPTX, TXT, MD, XLSX
"""
import io
from typing import Tuple

def extract_text_from_file(file_bytes: bytes, file_name: str, file_type: str) -> str:
    """
    Extract plain text content from multi-format uploaded files.
    """
    if file_name.endswith(".txt") or file_name.endswith(".md"):
        return file_bytes.decode("utf-8", errors="ignore")
    # Lead 3: Implement PyMuPDF, python-docx, python-pptx extraction
    return ""
