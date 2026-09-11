# Implementation Plan: AI-Powered POC Intelligence Platform

**Branch**: `001-poc-intelligence-platform` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-poc-intelligence-platform/spec.md`

---

## Summary

Build a unified full-stack enterprise platform partitioned into 4 distinct modules designed for parallel implementation by a team of 4 engineers:
1. **Module 1 (POC Management)**: Full CRUD, lifecycle states, document attachments, rich metadata, and AI summaries.
2. **Module 2 (Multi-Agent Research)**: CrewAI 5-agent research crew (Planning, Discovery, Analysis, Fact-Checking, Report Writing), live WebSocket progress, and Markdown report export.
3. **Module 3 (RAG Knowledge Chat Agent)**: LangChain ingestion pipeline (parsing, chunking, embeddings), PostgreSQL + pgvector retrieval, and 4 citation-backed chat modes.
4. **Module 4 (Auth & Administration)**: JWT authentication, RBAC middleware, team workspaces, audit logging, and LLM/system settings.

---

## Technical Context

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS, Lucide React, TanStack Query, React Hook Form + Zod, Recharts, React Markdown, Shiki/Prism.
- **Backend**: Python 3.11+, FastAPI (async), SQLAlchemy 2.0 (asyncpg), Alembic, Pydantic v2, Python-Jose (JWT), Argon2.
- **AI / Agent Layer**: LangChain (RAG, chains, embeddings, vectorstore connectors) & CrewAI (multi-agent coordination).
- **Storage & Search**: PostgreSQL 16+ with pgvector extension (structured entities + vector embeddings), Redis 7+ (job queue and cache).
- **Background Workers**: Celery / Redis worker for document ingestion and long-running CrewAI research jobs.
- **Document Parsers**: PyMuPDF (`fitz`), `python-docx`, `python-pptx`, `openpyxl`, `beautifulsoup4`.
- **Target Platform**: Modern Linux / Windows / Docker runtime environment.
- **Performance Constraints**: POC API response <200ms p95; RAG time-to-first-token <1.5s; Document ingestion <15s for 25MB file; Research job <3 mins.

---

## Constitution Check

*GATE: Passed. Complies fully with `.specify/memory/constitution.md`.*

| Principle / Rule | Compliance Status | Implementation Strategy |
|---|---|---|
| **I. 4-Module Decoupling** | PASS | Modules have isolated models, routes, services, and frontend pages with shared contracts. |
| **II. AI Grounding & Anti-Hallucination** | PASS | RAG requires chunk retrieval citations; CrewAI requires claim-to-source URL mapping. |
| **III. RBAC & Vector Security** | PASS | Route middleware enforces roles; Vector queries include user team/scope metadata filters. |
| **IV. Contract-First Integrity** | PASS | Pydantic v2 schemas and TypeScript type definitions aligned across all endpoints. |
| **V. Asynchronous Execution** | PASS | Research & document embedding run in Celery with real-time SSE / WebSocket updates. |

---

## Project Structure & 4-Team Ownership Layout

```text
poc-manager/
├── frontend/                               # React + TypeScript + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                         # Buttons, inputs, modals, cards, badges
│   │   │   ├── layout/                     # Sidebar, Navbar, PageLayout, ThemeToggle
│   │   │   ├── poc/                        # [TEAM 1] POC cards, forms, document uploaders
│   │   │   ├── research/                   # [TEAM 2] Research inputs, timeline, agent logs
│   │   │   ├── reports/                    # [TEAM 2] Markdown renderer, claim citation viewer
│   │   │   ├── chat/                       # [TEAM 3] Chat window, citation chips, mode switcher
│   │   │   ├── admin/                      # [TEAM 4] User tables, settings, audit log tables
│   │   │   └── auth/                       # [TEAM 4] Login, register, token refresh
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx           # Shared Metrics & Activity overview
│   │   │   ├── POCListPage.tsx             # [TEAM 1]
│   │   │   ├── CreatePOCPage.tsx           # [TEAM 1]
│   │   │   ├── POCDetailsPage.tsx          # [TEAM 1]
│   │   │   ├── ResearchPage.tsx            # [TEAM 2]
│   │   │   ├── ResearchProgressPage.tsx    # [TEAM 2]
│   │   │   ├── ResearchReportPage.tsx      # [TEAM 2]
│   │   │   ├── KnowledgeChatPage.tsx       # [TEAM 3]
│   │   │   ├── DocumentsPage.tsx           # [TEAM 1 & 3]
│   │   │   ├── LoginPage.tsx               # [TEAM 4]
│   │   │   ├── RegisterPage.tsx            # [TEAM 4]
│   │   │   ├── AdminPage.tsx               # [TEAM 4]
│   │   │   └── SettingsPage.tsx            # [TEAM 4]
│   │   ├── services/                       # API clients per module (pocService, researchService, chatService, authService)
│   │   ├── hooks/                          # Custom React hooks (usePOCs, useResearch, useChat, useAuth)
│   │   ├── stores/                         # Zustand state stores (authStore, pocStore, chatStore, researchStore)
│   │   └── types/                          # Shared TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                                # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py                         # Application entrypoint & middleware mounting
│   │   ├── core/                           # Config, database engine, security, RBAC guards
│   │   ├── api/routes/
│   │   │   ├── auth.py                     # [TEAM 4] Authentication endpoints
│   │   │   ├── users.py                    # [TEAM 4] User & role management
│   │   │   ├── teams.py                    # [TEAM 4] Workspace team management
│   │   │   ├── admin.py                    # [TEAM 4] Audit logs, system health, settings
│   │   │   ├── pocs.py                     # [TEAM 1] POC CRUD, archive, AI summary
│   │   │   ├── documents.py                # [TEAM 1 & 3] Document uploads, parsing, indexing
│   │   │   ├── research.py                 # [TEAM 2] Research job trigger, status, stream
│   │   │   ├── reports.py                  # [TEAM 2] Report retrieval, export, save-to-KB
│   │   │   └── chat.py                     # [TEAM 3] RAG conversations, queries, streaming
│   │   ├── models/                         # SQLAlchemy 2.0 async database models
│   │   ├── schemas/                        # Pydantic v2 request & response schemas
│   │   ├── services/                       # Business logic services per module
│   │   ├── agents/                         # [TEAM 2] CrewAI agent team, tasks, tools, flows
│   │   ├── langchain/                      # [TEAM 3] Ingestion, chunkers, retrievers, prompt templates
│   │   ├── workers/                        # Celery tasks (research_worker, ingestion_worker)
│   │   ├── repositories/                   # DB abstraction layer
│   │   └── utils/                          # File parsers, text cleaners, markdown formatters
│   ├── tests/                              # Unit, integration, and contract test suites
│   ├── requirements.txt
│   └── pyproject.toml
│
└── specs/001-poc-intelligence-platform/
    ├── spec.md                             # Complete feature requirements
    ├── plan.md                             # Architectural implementation plan (this file)
    ├── research.md                         # Tech stack & architectural decisions
    ├── data-model.md                       # PostgreSQL schema & entity constraints
    ├── contracts/
    │   └── api-contracts.md                # REST & WebSocket endpoint contracts
    ├── quickstart.md                       # Developer setup & validation guide
    └── tasks.md                            # Dependency-ordered implementation task breakdown
```

---

## 4-Team Work Breakdown & Integration Gates

### Team 1: POC Management Lead
- **Scope**: Models `POC`, `POCDocument`; CRUD routes `/api/v1/pocs`; File upload handlers; UI pages (`POCListPage`, `POCDetailsPage`, `CreatePOCPage`); AI summary generation.
- **Upstream Dependencies**: Team 4 Auth/Team tables for foreign keys.
- **Downstream Consumers**: Team 3 (indexing POC text), Team 2 (optional validation against internal POCs).

### Team 2: Multi-Agent Internet Research Lead
- **Scope**: Models `ResearchJob`, `ResearchSource`, `ResearchFinding`, `ResearchReport`, `AgentExecution`; CrewAI crew definitions; Web search tools; Celery research worker; SSE/WebSocket progress streamer; UI pages (`ResearchPage`, `ResearchProgressPage`, `ResearchReportPage`).
- **Upstream Dependencies**: Team 4 Auth for job authorization; Shared Redis queue.
- **Downstream Consumers**: Team 3 (saving finalized reports into RAG vectorstore).

### Team 3: RAG Knowledge Chat Lead
- **Scope**: Vector database integration (`pgvector`); Document ingestion pipeline (`file_parser`, `chunking`, `embeddings`); LangChain conversational retrieval chain; 4 chat modes; UI pages (`KnowledgeChatPage`, citation viewer).
- **Upstream Dependencies**: Team 1 (`pocs` & `poc_documents` records); Team 4 (permission filtering in vector search).

### Team 4: Authentication & Administration Lead
- **Scope**: Models `User`, `Team`, `AuditLog`, `SystemSetting`; JWT auth flow, password hashing, RBAC middleware (`PermissionChecker`); Admin routes `/api/v1/admin/*`, `/api/v1/teams/*`; UI pages (`LoginPage`, `RegisterPage`, `AdminPage`, `SettingsPage`).
- **Upstream Dependencies**: None (Foundation layer).
- **Downstream Consumers**: Teams 1, 2, 3 rely on Auth context and RBAC guards.
