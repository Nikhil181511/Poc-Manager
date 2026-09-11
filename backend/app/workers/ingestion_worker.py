from app.workers.celery_app import celery_app

@celery_app.task(name="tasks.ingest_document")
def ingest_document(document_id: str):
    """Celery worker task to parse, chunk, embed, and index document content."""
    pass
