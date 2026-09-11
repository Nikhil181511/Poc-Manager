import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.research_report import ResearchReport
from app.models.research_source import ResearchSource
from app.models.research_finding import ResearchFinding
from app.schemas.report import ResearchReportResponse
from app.services.research_service import ResearchService

router = APIRouter()

@router.get("/{report_id}")
async def get_report(report_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Retrieves the complete 17-section research report along with discovered sources and findings.
    """
    stmt = select(ResearchReport).where(ResearchReport.id == report_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()

    if not report:
        # Fallback check by research_job_id
        stmt_job = select(ResearchReport).where(ResearchReport.research_job_id == report_id)
        res_job = await db.execute(stmt_job)
        report = res_job.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Research report not found.")

    # Load sources & findings for this research job
    sources_stmt = select(ResearchSource).where(ResearchSource.research_job_id == report.research_job_id)
    sources_res = await db.execute(sources_stmt)
    sources = sources_res.scalars().all()

    findings_stmt = select(ResearchFinding).where(ResearchFinding.research_job_id == report.research_job_id)
    findings_res = await db.execute(findings_stmt)
    findings = findings_res.scalars().all()

    return {
        "id": report.id,
        "research_job_id": report.research_job_id,
        "title": report.title,
        "executive_summary": report.executive_summary,
        "content_markdown": report.content_markdown,
        "report_type": report.report_type,
        "status": report.status,
        "version": report.version,
        "created_by": report.created_by,
        "saved_to_knowledge_base": report.saved_to_knowledge_base,
        "sources": [
            {
                "id": s.id,
                "title": s.title,
                "url": s.url,
                "domain": s.domain,
                "source_type": s.source_type,
                "relevance_score": s.relevance_score,
                "verification_status": s.verification_status
            }
            for s in sources
        ],
        "findings": [
            {
                "id": f.id,
                "question": f.question,
                "finding": f.finding,
                "evidence": f.evidence,
                "confidence": f.confidence,
                "validation_status": f.validation_status
            }
            for f in findings
        ],
        "created_at": report.created_at,
        "updated_at": report.updated_at
    }

@router.post("/{report_id}/save-to-knowledge")
async def save_report_to_knowledge_base(report_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Flags the report as saved to the knowledge base and queues it for pgvector RAG indexing.
    """
    stmt = select(ResearchReport).where(ResearchReport.id == report_id)
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Research report not found.")

    report.saved_to_knowledge_base = True
    await db.commit()

    return {
        "report_id": report.id,
        "message": "Report successfully queued for RAG Knowledge Base indexing.",
        "saved_to_knowledge_base": True
    }
