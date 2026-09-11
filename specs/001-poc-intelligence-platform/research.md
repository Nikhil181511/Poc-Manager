# Research & Architecture Decisions: AI-Powered POC Intelligence Platform

## 1. Core Architecture Decisions

### Decision 1: Hybrid PostgreSQL with `pgvector` for Structured & Vector Storage
- **Decision**: Use PostgreSQL 16+ with the `pgvector` extension as the primary unified datastore for both relational data (Users, Teams, POCs, Research, Audit logs) and embeddings vectors.
- **Rationale**: 
  - Eliminates the operational overhead of running a separate vector database cluster (like Qdrant or Pinecone) during MVP and standard deployments.
  - Allows atomic ACID transactions combining entity updates and vector indexing.
  - Enables powerful relational metadata filtering (e.g., `WHERE user_team_id = X AND status = 'Completed'`) directly inside vector cosine-similarity queries.
- **Alternatives Considered**: 
  - *Chroma / FAISS*: Good for local prototyping, but lacks transactional ACID integrity and multi-user scaling.
  - *Qdrant / Pinecone*: Excellent dedicated vector search, but adds infrastructure complexity and external service costs for MVP.

---

### Decision 2: Framework Delineation: CrewAI for Agents, LangChain for RAG
- **Decision**: 
  - Use **CrewAI** exclusively for Module 2 (Multi-Agent Research) where sequential and hierarchical collaboration between autonomous roles (Planner, Searcher, Analyst, Fact-Checker, Writer) is required.
  - Use **LangChain** (`langchain-core`, `langchain-community`) for Module 3 (RAG Knowledge Chat) and ingestion pipelines (document loaders, recursive character text splitters, embeddings, conversational memory, structured output validation).
- **Rationale**: 
  - CrewAI provides high-level multi-agent orchestration, delegation, and role-based task workflows with built-in output passing.
  - LangChain excels at modular document extraction, chunking math, embedding generation, vectorstore retrieval, and streaming LLM chains.
- **Alternatives Considered**: 
  - *LangGraph for everything*: Higher learning curve and boilerplate for basic agent roles compared to CrewAI.
  - *CrewAI for chat*: Overkill and latency-prohibitive for real-time conversational retrieval.

---

### Decision 3: Background Worker Architecture: Redis + Celery
- **Decision**: Use Redis as the broker and Celery as the worker engine for executing multi-agent research jobs (which can take 1–3 minutes) and document parsing/embedding pipelines.
- **Rationale**:
  - Keeps FastAPI HTTP request threads non-blocking.
  - Supports task retries, timeout management, concurrency control, and job cancellation.
  - Easily publishes progress events back to Redis pub/sub for WebSocket / SSE streaming to the React UI.
- **Alternatives Considered**:
  - *FastAPI `BackgroundTasks`*: Lacks distributed queueing, persistence across server restarts, and multi-process scaling.
  - *Dramatiq / RQ*: Viable, but Celery is industry standard with mature ecosystem and monitoring.

---

### Decision 4: Security & Zero-Trust Vector RBAC
- **Decision**: Enforce permission checks at two distinct layers:
  1. **HTTP Endpoint Layer**: FastAPI dependency injection (`get_current_active_user`, `require_role`, `require_team_access`).
  2. **Vector Retrieval Layer**: Vector similarity queries MUST inject metadata filters based on the querying user's role and team permissions (`access_scope = 'public' OR team_id = current_user.team_id`).
- **Rationale**: Prevents data leakage where users could otherwise retrieve sensitive POC document embeddings via general chat queries.

---

### Decision 5: Anti-Hallucination & Evidence Mapping Guardrails
- **Decision**:
  - **Module 2 (Research)**: Every claim in the generated report must link to an extracted `ResearchFinding` and `ResearchSource` ID. Claims without matching sources must be flagged as `uncertain`.
  - **Module 3 (RAG Chat)**: The system prompt instructs the model to only formulate answers from the provided context chunks. Citations (`[POC-101: Doc Architecture.pdf#p3]`) must be embedded in responses. A minimum cosine similarity threshold of 0.65 is required for chunks.
