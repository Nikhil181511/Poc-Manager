# AI-Powered POC Intelligence Platform

An enterprise platform integrating conventional Proof of Concept (POC) lifecycle management, autonomous internet-based multi-agent research with CrewAI, citation-backed RAG knowledge chat with LangChain, and role-based workspace administration.

---

## 🏗️ 4-Module Team Architecture

This project is partitioned into 4 distinct workstreams for parallel team execution:

| Module | Team Lead / Owner | Primary Responsibilities | Core Stack & Paths |
|---|---|---|---|
| **Module 1: POC Management System** | **Engineer 1** | POC CRUD, lifecycle state tracking, multi-format attachments (PDF/DOCX/MD up to 25MB), category filtering, and AI summary generation. | `backend/app/api/routes/pocs.py`<br>`frontend/src/pages/POCListPage.tsx` |
| **Module 2: Multi-Agent Internet Research** | **Engineer 2 (You)** | CrewAI 5-agent crew (Planner, Discovery, Analyst, Fact-Checker, Report Writer), live SSE progress streaming, and 17-section Markdown report generation. | `backend/app/agents/`<br>`backend/app/workers/research_worker.py`<br>`frontend/src/pages/ResearchProgressPage.tsx` |
| **Module 3: RAG-Based Knowledge Chat** | **Engineer 3** | Ingestion pipeline, recursive chunking, embeddings, PostgreSQL + `pgvector` store, 4 chat modes, and citation chips. | `backend/app/langchain/`<br>`backend/app/api/routes/chat.py`<br>`frontend/src/pages/KnowledgeChatPage.tsx` |
| **Module 4: Auth, Workspace & Admin** | **Engineer 4** | JWT authentication, RBAC guards, team workspaces, audit logging, and LLM/system settings. | `backend/app/core/security.py`<br>`backend/app/core/permissions.py`<br>`frontend/src/pages/AdminPage.tsx` |

---

## 📁 Repository Structure

```text
poc-manager/
├── docker-compose.yml              # Local PostgreSQL (pgvector) & Redis
├── .gitignore
├── README.md
│
├── backend/                        # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                 # FastAPI application entrypoint
│   │   ├── core/                   # Config, DB connection, security & RBAC
│   │   ├── api/routes/             # Modular API endpoints (auth, pocs, research, chat, admin)
│   │   ├── models/                 # SQLAlchemy 2.0 async database models
│   │   ├── schemas/                # Pydantic v2 schemas
│   │   ├── services/               # Business logic layer
│   │   ├── agents/                 # [MODULE 2] CrewAI agents, tasks, tools & flows
│   │   ├── langchain/              # [MODULE 3] Ingestion, chunking, embeddings, RAG chains
│   │   ├── workers/                # Celery background workers (research & ingestion)
│   │   ├── repositories/           # Database query repositories
│   │   └── utils/                  # File parsers, chunkers, text sanitizers
│   ├── tests/                      # Pytest test suites per module
│   ├── requirements.txt            # Python dependencies
│   └── .env.example
│
├── frontend/                       # React 18 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI, layout & module components
│   │   ├── pages/                  # Page routes for POCs, Research, Chat, Admin, Auth
│   │   ├── services/               # Axios/Fetch API clients
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── stores/                 # Zustand state stores
│   │   ├── types/                  # TypeScript interface contracts
│   │   ├── routes/                 # React Router definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
└── specs/001-poc-intelligence-platform/
    ├── spec.md                     # Feature requirements
    ├── plan.md                     # Architectural implementation plan
    ├── research.md                 # Technical decisions
    ├── data-model.md               # PostgreSQL schema & constraints
    ├── contracts/api-contracts.md  # REST & SSE API contracts
    ├── quickstart.md               # Team setup & validation guide
    └── tasks.md                    # Actionable task checklist
```

---

## 🚀 Quick Start for Developers

### 1. Start Infrastructure (PostgreSQL + pgvector & Redis)
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Update .env with your LLM API keys (Google Gemini / OpenAI)

# Run FastAPI Dev Server:
uvicorn app.main:app --reload --port 8000
```
Swagger API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Application UI: `http://localhost:5173`

---

## 👥 Module Lead Instructions

1. Consult [`specs/001-poc-intelligence-platform/spec.md`](./specs/001-poc-intelligence-platform/spec.md) for domain requirements.
2. Review [`specs/001-poc-intelligence-platform/contracts/api-contracts.md`](./specs/001-poc-intelligence-platform/contracts/api-contracts.md) before implementing API routes or frontend hooks.
3. Check off tasks in [`specs/001-poc-intelligence-platform/tasks.md`](./specs/001-poc-intelligence-platform/tasks.md) as you complete them.
