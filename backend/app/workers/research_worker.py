from app.workers.celery_app import celery_app

@celery_app.task(name="tasks.execute_research_job")
def execute_research_job(research_job_id: str):
    """Celery worker task to run the CrewAI multi-agent research workflow."""
    pass
