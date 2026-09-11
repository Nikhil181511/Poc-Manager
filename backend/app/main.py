from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import (
    auth,
    users,
    teams,
    pocs,
    documents,
    research,
    reports,
    chat,
    admin,
    settings as app_settings
)

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-stack AI-powered POC management, CrewAI research, and RAG knowledge platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Route Mounts (Prefix: /api/v1)
api_prefix = "/api/v1"
app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Module 4: Authentication"])
app.include_router(users.router, prefix=f"{api_prefix}/users", tags=["Module 4: Users"])
app.include_router(teams.router, prefix=f"{api_prefix}/teams", tags=["Module 4: Teams"])
app.include_router(admin.router, prefix=f"{api_prefix}/admin", tags=["Module 4: Administration"])
app.include_router(app_settings.router, prefix=f"{api_prefix}/settings", tags=["Module 4: Settings"])

app.include_router(pocs.router, prefix=f"{api_prefix}/pocs", tags=["Module 1: POC Management"])
app.include_router(documents.router, prefix=f"{api_prefix}/documents", tags=["Module 1 & 3: Documents"])

app.include_router(research.router, prefix=f"{api_prefix}/research", tags=["Module 2: Multi-Agent Research"])
app.include_router(reports.router, prefix=f"{api_prefix}/reports", tags=["Module 2: Research Reports"])

app.include_router(chat.router, prefix=f"{api_prefix}/chat", tags=["Module 3: RAG Knowledge Chat"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV
    }
