# Tasks: AI-Powered POC Intelligence Platform

**Feature**: AI-Powered POC Intelligence Platform
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)
**Structure**: Partitioned into 4 Autonomous Workstreams for a 4-Engineer Team

---

## Team Ownership Matrix

- **Lead 1 (POC Lead)**: Phase 4 (User Story 1 - POC Management & Attachments)
- **Lead 2 (Research Lead)**: Phase 5 (User Story 3 - Multi-Agent Research System)
- **Lead 3 (RAG Chat Lead)**: Phase 6 (User Story 4 - Vector Ingestion & RAG Chat)
- **Lead 4 (Auth & Admin Lead)**: Phase 3 (User Story 2 - Auth, Workspace & RBAC)

---

## Dependencies & Execution Order

```text
Phase 1: Setup (Repository & Scaffolding)
   │
   ▼
Phase 2: Foundational (Database Engine, Base Models, Security Core)
   │
   ├──────────────────────────────┬──────────────────────────────┐
   ▼                              ▼                              ▼
Phase 3: Module 4 (Auth/Admin) Phase 4: Module 1 (POC CRUD)  Phase 5: Module 2 (CrewAI Research)
[Lead 4]                       [Lead 1]                       [Lead 2]
   │                              │                              │
   └──────────────────────────────┼──────────────────────────────┘
                                  ▼
                     Phase 6: Module 3 (RAG Chat & Vector DB)
                     [Lead 3] (Consumes POCs, Reports & Auth Context)
                                  │
                                  ▼
                     Phase 7: End-to-End Integration & Polish
```

---

## Phase 1: Project Setup & Scaffolding

- [ ] T001 Initialize backend directory structure, `backend/requirements.txt`, and virtual environment configuration
- [ ] T002 [P] Initialize frontend Vite React TypeScript project with Tailwind CSS and dependencies in `frontend/package.json`
- [ ] T003 [P] Create backend configuration and environment loader in `backend/app/core/config.py`
- [ ] T004 [P] Create environment templates in `backend/.env.example` and `frontend/.env.example`

---

## Phase 2: Foundational Core (Prerequisites for All Modules)

- [ ] T005 Setup async SQLAlchemy engine, session management, and Base model in `backend/app/core/database.py`
- [ ] T006 [P] Configure Alembic migrations environment and pgvector extension in `backend/alembic/env.py`
- [ ] T007 [P] Implement core password hashing (Argon2) and JWT token encoder/decoder in `backend/app/core/security.py`
- [ ] T008 [P] Implement centralized structured logging and correlation ID middleware in `backend/app/core/logging.py`
- [ ] T009 [P] Setup Celery application instance and Redis broker connection in `backend/app/workers/celery_app.py`
- [ ] T010 [P] Setup frontend API client with JWT interceptors and error handling in `frontend/src/services/api.ts`
- [ ] T011 [P] Create reusable UI layout, sidebar navigation, navbar, and theme toggle in `frontend/src/components/layout/`

---

## Phase 3: Module 4 - Authentication, Workspace & Administration (Lead 4)

**Goal**: Deliver complete user authentication, role-based access control, team isolation, and administrative controls.
**Independent Test**: Register users with different roles, verify JWT login/refresh, test RBAC endpoint barriers, and check audit logging.

- [ ] T012 [P] [US2] Create `Team`, `User`, and `AuditLog` SQLAlchemy models in `backend/app/models/user.py`, `team.py`, and `audit_log.py`
- [ ] T013 [P] [US2] Create Pydantic v2 validation schemas for Auth, User, and Team in `backend/app/schemas/auth.py` and `user.py`
- [ ] T014 [US2] Implement RBAC permission checker and dependency guards in `backend/app/core/permissions.py`
- [ ] T015 [US2] Implement AuthService and UserService in `backend/app/services/auth_service.py` and `user_service.py`
- [ ] T016 [US2] Implement Auth routes (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me`) in `backend/app/api/routes/auth.py`
- [ ] T017 [US2] Implement Admin routes (`/admin/users`, `/admin/audit-logs`, `/admin/settings`) in `backend/app/api/routes/admin.py`
- [ ] T018 [P] [US2] Implement frontend auth state store in `frontend/src/stores/authStore.ts`
- [ ] T019 [P] [US2] Create `LoginPage.tsx` and `RegisterPage.tsx` in `frontend/src/pages/`
- [ ] T020 [US2] Create `AdminPage.tsx` and `SettingsPage.tsx` with user management and audit log tables in `frontend/src/pages/`

---

## Phase 4: Module 1 - POC Management System (Lead 1)

**Goal**: Deliver full CRUD operations for POC records, document attachment management, search/filtering, and AI summaries.
**Independent Test**: Create a POC with technical specifications, attach PDF/MD files, update progress/outcomes, and verify AI summary generation.

- [ ] T021 [P] [US1] Create `POC` and `POCDocument` SQLAlchemy models in `backend/app/models/poc.py` and `poc_document.py`
- [ ] T022 [P] [US1] Create Pydantic validation schemas for POC creation, update, and search in `backend/app/schemas/poc.py` and `document.py`
- [ ] T023 [US1] Implement POC repository with filtering, pagination, and archiving in `backend/app/repositories/poc_repository.py`
- [ ] T024 [US1] Implement POC business logic and document upload handlers in `backend/app/services/poc_service.py` and `document_service.py`
- [ ] T025 [US1] Implement POC API routes (`/pocs`, `/pocs/{id}`, `/pocs/{id}/archive`, `/pocs/{id}/summary`) in `backend/app/api/routes/pocs.py`
- [ ] T026 [US1] Implement Document API routes (`/pocs/{id}/documents`, `/documents/{id}`) in `backend/app/api/routes/documents.py`
- [ ] T027 [P] [US1] Implement frontend POC state store and API client in `frontend/src/stores/pocStore.ts` and `frontend/src/services/pocService.ts`
- [ ] T028 [P] [US1] Create POC list view with filter badges and search in `frontend/src/pages/POCListPage.tsx`
- [ ] T029 [P] [US1] Create rich multi-step POC creation/edit form in `frontend/src/pages/CreatePOCPage.tsx`
- [ ] T030 [US1] Create POC details view with tech stack overview, document manager, and AI summary button in `frontend/src/pages/POCDetailsPage.tsx`

---

## Phase 5: Module 2 - Multi-Agent Internet Research System (Lead 2)

**Goal**: Deliver autonomous 5-agent CrewAI research workflow, live execution progress streaming, fact-checking validation, and Markdown report export.
**Independent Test**: Dispatch a research query, observe real-time agent state transitions via WebSocket/SSE, and view verified 17-section report with source citations.

- [ ] T031 [P] [US3] Create `ResearchJob`, `ResearchSource`, `ResearchFinding`, `ResearchReport`, and `AgentExecution` models in `backend/app/models/`
- [ ] T032 [P] [US3] Create Pydantic schemas for research requests, progress events, and reports in `backend/app/schemas/research.py` and `report.py`
- [ ] T033 [US3] Implement search and content extraction tools (Tavily/DuckDuckGo, URL scraper, GitHub metadata) in `backend/app/agents/tools.py`
- [ ] T034 [US3] Define the 5 CrewAI agents (Planning, Discovery, Analysis, Fact-Checker, Report Writer) in `backend/app/agents/agents.py`
- [ ] T035 [US3] Define CrewAI tasks, execution sequence, and structured output formatting in `backend/app/agents/tasks.py` and `crew.py`
- [ ] T036 [US3] Implement Celery asynchronous research worker in `backend/app/workers/research_worker.py`
- [ ] T037 [US3] Implement Research API routes (`/research`, `/research/{id}/progress`, `/research/{id}/report`) and SSE stream in `backend/app/api/routes/research.py` and `reports.py`
- [ ] T038 [P] [US3] Implement frontend research store and service in `frontend/src/stores/researchStore.ts` and `frontend/src/services/researchService.ts`
- [ ] T039 [P] [US3] Create research topic submission page in `frontend/src/pages/ResearchPage.tsx`
- [ ] T040 [US3] Create real-time agent workflow progress timeline and log stream in `frontend/src/pages/ResearchProgressPage.tsx`
- [ ] T041 [US3] Create structured Markdown report viewer with source citations, export, and "Save to KB" button in `frontend/src/pages/ResearchReportPage.tsx`

---

## Phase 6: Module 3 - RAG-Based Knowledge Chat Agent (Lead 3)

**Goal**: Deliver document ingestion pipeline, pgvector similarity store, and conversational chat agent with 4 modes and citation chips.
**Independent Test**: Index existing POCs/documents, ask natural-language questions across organization knowledge, and verify grounded answers with citation chips.

- [ ] T042 [P] [US4] Create `DocumentChunk` (pgvector), `Conversation`, and `ChatMessage` models in `backend/app/models/`
- [ ] T043 [P] [US4] Create Pydantic schemas for chat sessions, messages, and citations in `backend/app/schemas/chat.py`
- [ ] T044 [US4] Implement multi-format document text extractors (PDF, DOCX, MD, TXT) in `backend/app/utils/file_parser.py`
- [ ] T045 [US4] Implement text chunker (1000 tokens / 150 overlap) and metadata annotator in `backend/app/utils/chunking.py`
- [ ] T046 [US4] Implement LangChain embedding generator and pgvector vectorstore adapter in `backend/app/langchain/embeddings.py` and `retrievers.py`
- [ ] T047 [US4] Implement asynchronous Celery document ingestion worker in `backend/app/workers/ingestion_worker.py`
- [ ] T048 [US4] Implement RAG conversational chain with prompt templates, anti-hallucination guards, and source formatter in `backend/app/langchain/chains.py`
- [ ] T049 [US4] Implement Chat API routes (`/chat/conversations`, `/chat/conversations/{id}/messages`) with SSE streaming in `backend/app/api/routes/chat.py`
- [ ] T050 [P] [US4] Implement frontend chat store and service in `frontend/src/stores/chatStore.ts` and `frontend/src/services/chatService.ts`
- [ ] T051 [US4] Create conversational chat interface with mode switcher (Org, POC, Doc, Category), streaming text, and citation chips in `frontend/src/pages/KnowledgeChatPage.tsx`

---

## Phase 7: Cross-Cutting Integration, Dashboard & Verification

- [ ] T052 Create unified executive dashboard aggregating POC stats, recent research, and knowledge count in `frontend/src/pages/DashboardPage.tsx`
- [ ] T053 [P] Implement end-to-end contract and integration tests for Auth & RBAC in `backend/tests/test_auth.py` and `test_permissions.py`
- [ ] T054 [P] Implement end-to-end integration tests for POC CRUD and document attachment in `backend/tests/test_poc_crud.py` and `test_documents.py`
- [ ] T055 [P] Implement unit and mock tests for CrewAI research execution in `backend/tests/test_research.py`
- [ ] T056 [P] Implement RAG vector retrieval and citation verification tests in `backend/tests/test_chat.py`
- [ ] T057 Validate full quickstart flow from `specs/001-poc-intelligence-platform/quickstart.md`
