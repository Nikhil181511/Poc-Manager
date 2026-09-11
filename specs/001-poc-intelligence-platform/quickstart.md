# Quickstart & Team Validation Guide

This guide describes how to run and validate the 4 modules locally.

---

## 1. Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 18+ and npm
- **PostgreSQL**: 16+ with `pgvector` extension enabled (`CREATE EXTENSION IF NOT EXISTS vector;`)
- **Redis**: 7+ running locally on port 6379

---

## 2. Environment Configuration

Create a `.env` file in `backend/` based on `.env.example`:

```env
APP_NAME="POC Intelligence Platform"
APP_ENV=development
DEBUG=true

# Database & Queue
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/poc_platform
REDIS_URL=redis://localhost:6379/0

# Authentication
JWT_SECRET_KEY=dev_secret_key_change_in_production_123456
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI Models & Providers
LLM_PROVIDER=google
GOOGLE_API_KEY=your_gemini_api_key_here
EMBEDDING_PROVIDER=google
VECTOR_DB_PROVIDER=pgvector

# RAG & Chunking
MAX_UPLOAD_SIZE_MB=25
CHUNK_SIZE=1000
CHUNK_OVERLAP=150
RETRIEVAL_TOP_K=5
```

---

## 3. Backend Setup & Run

```bash
# 1. Navigate to backend
cd backend

# 2. Setup virtual environment
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations
alembic upgrade head

# 5. Start Celery worker in a separate terminal
celery -A app.workers.celery_app worker --loglevel=info

# 6. Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`

---

## 4. Frontend Setup & Run

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
Frontend UI: `http://localhost:5173`

---

## 5. End-to-End Validation Scenarios per Module Lead

### Lead 1 (POC Module):
1. Navigate to `http://localhost:5173/pocs/new`.
2. Fill in POC fields and attach a sample PDF or Markdown file.
3. Verify POC appears in `http://localhost:5173/pocs`.
4. Click into the POC and trigger "Generate AI Summary".

### Lead 2 (Research Module):
1. Navigate to `http://localhost:5173/research`.
2. Enter topic: *"Evaluation of FastEmbed vs SentenceTransformers for CPU RAG"*.
3. Watch real-time progress across the 5 CrewAI agents on `http://localhost:5173/research/progress/:id`.
4. Review the generated 17-section report and click *"Save to Knowledge Base"*.

### Lead 3 (RAG Chat Module):
1. Navigate to `http://localhost:5173/chat`.
2. Select *"Organization Knowledge"* mode.
3. Query: *"What were the evaluation results of our FastEmbed POC?"*.
4. Verify the answer stream and confirm citation chip links directly to the POC.

### Lead 4 (Auth & Admin Module):
1. Register user with `Admin` role and a user with `Viewer` role.
2. Verify Admin can access `/admin`, inspect audit logs, and configure LLM settings.
3. Verify Viewer is blocked from POC editing or deletion.
