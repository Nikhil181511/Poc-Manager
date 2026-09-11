# REST & WebSocket API Contracts

Base URL: `/api/v1`

---

## 1. Authentication & Admin APIs (Module 4 - Lead 4)

### `POST /auth/register`
- **Request**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@company.com",
    "password": "SecurePassword123!",
    "role": "Developer",
    "team_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "user": {
      "id": "uuid",
      "name": "Alex Mercer",
      "email": "alex@company.com",
      "role": "Developer"
    },
    "access_token": "jwt_string",
    "refresh_token": "refresh_string",
    "token_type": "bearer"
  }
  ```

### `POST /auth/login`
- **Request**:
  ```json
  {
    "email": "alex@company.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** `200 OK`: Same as register.

### `GET /admin/audit-logs`
- **Headers**: `Authorization: Bearer <token>` (Requires `Admin` role)
- **Query Params**: `entity_type`, `user_id`, `limit`, `offset`
- **Response** `200 OK`:
  ```json
  {
    "total": 142,
    "items": [
      {
        "id": "uuid",
        "action": "UPDATE",
        "entity_type": "POC",
        "entity_id": "uuid",
        "user_name": "Alex Mercer",
        "created_at": "2026-09-11T12:00:00Z"
      }
    ]
  }
  ```

---

## 2. POC Management APIs (Module 1 - Lead 1)

### `POST /pocs`
- **Request**:
  ```json
  {
    "poc_code": "POC-2026-001",
    "title": "Evaluate Qdrant vs pgvector",
    "short_description": "Benchmarking vector databases for enterprise RAG.",
    "detailed_description": "Deep architectural test of retrieval speed and RAM overhead.",
    "business_problem": "Need low-latency vector search under 50ms at scale.",
    "technical_problem": "Evaluating memory usage and filtering performance.",
    "objective": "Select primary vector DB for production platform.",
    "scope": "Evaluate indexing speed, cosine recall, and RAM footprint.",
    "category": "RAG",
    "priority": "High",
    "status": "In Progress",
    "team_id": "uuid",
    "technology_stack": ["Python", "FastAPI", "pgvector", "Qdrant", "PostgreSQL"],
    "start_date": "2026-09-01",
    "expected_end_date": "2026-09-30"
  }
  ```
- **Response** `201 Created`: Full `POC` object with `id`, `owner_id`, `created_at`.

### `GET /pocs`
- **Query Params**: `search`, `category`, `status`, `team_id`, `is_archived`, `limit`, `offset`
- **Response** `200 OK`:
  ```json
  {
    "total": 24,
    "items": [ { /* POC Object */ } ]
  }
  ```

### `POST /pocs/{poc_id}/documents`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: `file` (Binary), `description` (string)
- **Response** `201 Created`:
  ```json
  {
    "id": "uuid",
    "poc_id": "uuid",
    "file_name": "benchmark_results.pdf",
    "file_size": 1048576,
    "processing_status": "QUEUED",
    "indexing_status": "NOT_INDEXED"
  }
  ```

### `GET /pocs/{poc_id}/summary` (AI Summary)
- **Response** `200 OK`:
  ```json
  {
    "poc_id": "uuid",
    "ai_summary": "This POC successfully compared pgvector and Qdrant across 1M 1536-dim vectors. pgvector demonstrated lower infrastructure footprint while maintaining 98.4% recall."
  }
  ```

---

## 3. Multi-Agent Research APIs (Module 2 - Lead 2)

### `POST /research`
- **Request**:
  ```json
  {
    "topic": "Compare LangChain, LlamaIndex, and Haystack for Production RAG",
    "research_type": "comparison",
    "depth": "deep",
    "date_range": "last_12_months",
    "source_preferences": ["official_docs", "github_repo", "technical_blog"]
  }
  ```
- **Response** `202 Accepted`:
  ```json
  {
    "research_id": "uuid",
    "status": "QUEUED",
    "message": "Research job dispatched to CrewAI worker."
  }
  ```

### `GET /research/{research_id}/progress` (or WebSocket `/ws/research/{research_id}`)
- **Response** `200 OK` (or WS event stream):
  ```json
  {
    "research_id": "uuid",
    "status": "ANALYZING",
    "progress": 60,
    "current_agent": "Information Extraction and Technical Analysis Agent",
    "current_task": "Synthesizing framework feature matrix and trade-offs",
    "sources_count": 8,
    "findings_count": 14,
    "events": [
      { "timestamp": "2026-09-11T12:01:00Z", "agent": "Planning Agent", "message": "Research plan created with 5 sub-questions." },
      { "timestamp": "2026-09-11T12:01:45Z", "agent": "Discovery Agent", "message": "Discovered 8 relevant documentation sources." }
    ]
  }
  ```

### `GET /research/{research_id}/report`
- **Response** `200 OK`:
  ```json
  {
    "report_id": "uuid",
    "research_id": "uuid",
    "title": "Comprehensive Framework Evaluation: LangChain vs LlamaIndex vs Haystack",
    "executive_summary": "Comparative architectural review...",
    "content_markdown": "# 1. Executive Summary\n...",
    "saved_to_knowledge_base": false,
    "sources": [
      { "id": "uuid", "title": "LangChain Docs", "url": "https://python.langchain.com", "domain": "langchain.com" }
    ],
    "findings": [
      { "question": "Which framework has best production tooling?", "finding": "...", "confidence": 0.92 }
    ]
  }
  ```

---

## 4. RAG Knowledge Chat APIs (Module 3 - Lead 3)

### `POST /chat/conversations`
- **Request**:
  ```json
  {
    "title": "Questions on previous Vector DB POCs",
    "mode": "ORGANIZATION",
    "poc_id": null
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "id": "uuid",
    "title": "Questions on previous Vector DB POCs",
    "mode": "ORGANIZATION",
    "created_at": "2026-09-11T12:05:00Z"
  }
  ```

### `POST /chat/conversations/{conversation_id}/messages` (Streaming)
- **Request**:
  ```json
  {
    "content": "What were the memory benchmarks for pgvector in our earlier POC?",
    "stream": true
  }
  ```
- **Response** `Server-Sent Events (SSE)`:
  - `event: token` -> `data: {"text": "In "}`
  - `event: token` -> `data: {"text": "POC-2026-001, "}`
  - `event: token` -> `data: {"text": "pgvector consumed 2.4 GB RAM for 1M vectors."}`
  - `event: sources` ->
    ```json
    {
      "sources": [
        {
          "poc_code": "POC-2026-001",
          "poc_title": "Evaluate Qdrant vs pgvector",
          "document_name": "benchmark_results.pdf",
          "section": "Memory Footprint",
          "page": 4,
          "similarity_score": 0.89
        }
      ]
    }
    ```
  - `event: end` -> `data: {"done": true}`
