# AI-Powered POC Intelligence Platform Constitution

## Core Principles

### I. Strict 4-Module Architecture & Domain Boundary Isolation
The system MUST be strictly decoupled into 4 autonomous modules:
1. **Module 1: POC Management System** (CRUD, lifecycle tracking, metadata, metrics, and document attachments)
2. **Module 2: Multi-Agent Internet Research System** (CrewAI multi-agent coordinator, source discovery, validation, report generation)
3. **Module 3: RAG Knowledge Chat Agent** (LangChain ingestion pipeline, vector retrieval, embeddings, grounded citation generation)
4. **Module 4: Authentication, Workspace & Administration** (JWT auth, RBAC permissions, audit logging, admin configuration)

Cross-module interaction MUST occur only via well-defined internal service interfaces and database models. Direct monkey-patching or unstructured tight coupling across modules is strictly forbidden.

### II. AI Grounding & Anti-Hallucination Mandate (NON-NEGOTIABLE)
- RAG chat and research generation MUST be strictly grounded in verified context (internal ingested documents or verified web sources).
- The chat agent MUST explicitly cite its sources (POC code, document name, section, page).
- If retrieved internal context is insufficient, the system MUST state that information is unavailable rather than fabricating facts.
- Multi-agent research reports MUST maintain a verified claim-to-source mapping.

### III. Security, Access Control & Safety Guardrails
- **Zero-Trust Access Control**: RBAC MUST be enforced at both API route endpoints and vector retrieval layers (users cannot retrieve embeddings for POCs or documents they do not have permission to view).
- **Prompt Injection Defense**: All external content (web pages, READMEs, uploaded files) MUST be treated as untrusted data and sanitized. System prompts and API credentials must never be leaked.
- **File Safety**: Uploads are restricted by MIME type, sanitized against path traversal, and capped at 25MB.
- **Credential Hygiene**: API keys (LLM, search, database) MUST reside strictly in server environment variables and never be exposed to the client.

### IV. Contract-First API & Structured Data Integrity
- All API request and response bodies MUST use strict Pydantic v2 validation models.
- All database mutations MUST use SQLAlchemy 2.0 async models with PostgreSQL transactions.
- LLM outputs for automated extraction, ranking, and validation MUST produce structured JSON matching Pydantic schemas.

### V. Asynchronous Execution & Observability
- Long-running workflows (multi-agent research, document OCR/chunking/embedding, bulk reindexing) MUST execute as background worker jobs (Celery/Redis) with real-time status reporting via WebSocket or Server-Sent Events (SSE).
- Every asynchronous job MUST carry a unique `job_id` or `correlation_id` attached to all logs, traces, and agent executions.

## Architectural & Technical Constraints

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS, Lucide React, TanStack Query, React Hook Form + Zod, React Markdown.
- **Backend**: Python 3.11+, FastAPI (async), SQLAlchemy (asyncpg), Alembic, Pydantic v2.
- **AI Orchestration**: LangChain (for RAG chains, retrievers, document loaders, embeddings, prompt templates) & CrewAI (for multi-agent research orchestration).
- **Persistence**: PostgreSQL (primary structured database) + pgvector (or Qdrant/Chroma for vector storage), Redis (queue & cache).
- **Document Parsers**: PyMuPDF/pypdf, python-docx, python-pptx, openpyxl, BeautifulSoup4, markdown.

## Team Ownership & Governance Structure

The platform is designed for a 4-engineer parallel delivery model:
- **Lead 1 (POC Module)**: Responsible for POC CRUD, document attachment lifecycle, UI forms/details, and AI summary triggers.
- **Lead 2 (Research Module)**: Responsible for CrewAI agent teams, search tools, validation agents, research jobs, and report workspace.
- **Lead 3 (RAG Chat Module)**: Responsible for ingestion pipeline, text chunking, embeddings, pgvector storage, and context-aware chat UI.
- **Lead 4 (Auth & Admin Module)**: Responsible for JWT auth, RBAC middleware, team workspaces, system health, settings, and audit logs.

### Amendment Procedure
1. Any modification to this Constitution requires explicit approval and version incrementing (Semantic Versioning).
2. All feature specifications, implementation plans, and tasks MUST pass the Constitution Check before execution.

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
