# IDEON — Implementation Plan

## Development Strategy

IDEON will be built incrementally as a **Python modular monolith** with a Next.js frontend.

The implementation priority is:

```text
Project Foundation
        ↓
Database + Authentication
        ↓
Core API
        ↓
LLM Infrastructure
        ↓
Core Agents
        ↓
LangGraph Workflow
        ↓
Web Research + RAG
        ↓
Financial Engine
        ↓
Artifact Generation
        ↓
Startup Chat
        ↓
Selective Re-execution
        ↓
Frontend + Realtime
        ↓
Testing + Deployment
```

---

# Phase 1 — Project Foundation

### Goal
Set up the development environment and minimal backend.

### Tasks

- Configure Python environment with `uv`.
- Set up backend package structure.
- Configure `requirements.txt`.
- Configure `.env` and `.env.example`.
- Set up FastAPI.
- Create `/api/v1/`.
- Add basic application configuration.
- Add health endpoint.

### Deliverable

A running FastAPI backend with:

```text
GET /api/v1/health
```

---

# Phase 2 — Database + Authentication

### Goal
Establish persistent storage and user authentication.

### Tasks

- Connect to Supabase PostgreSQL.
- Configure async SQLModel/SQLAlchemy.
- Configure Psycopg 3.
- Initialize Alembic.
- Create core database models.
- Create repositories.
- Integrate Supabase Auth.
- Implement authentication dependencies.
- Implement startup ownership.

### Core entities

```text
User
Startup
FounderProfile
StartupConfiguration
AnalysisRun
AgentOutput
Artifact
ChatSession
ChatMessage
```

### Deliverable

An authenticated user can create and manage their own startup data.

---

# Phase 3 — Core API

### Goal
Build the API layer required by the application.

### Tasks

Implement endpoints for:

- Authentication
- User information
- Startups
- Founder profiles
- Startup configuration
- Analysis runs
- Artifacts
- Chat

### Deliverable

The backend can manage the complete startup lifecycle without AI functionality.

---

# Phase 4 — LLM Infrastructure

### Goal
Create a reusable Gemini integration.

### Tasks

- Configure Gemini.
- Create centralized Gemini client.
- Configure model settings.
- Implement structured output handling.
- Define Pydantic output contracts.
- Add common LLM error handling.
- Organize agent prompts.

### Deliverable

A reliable flow:

```text
Context
 ↓
Prompt
 ↓
Gemini
 ↓
Structured Output
 ↓
Validation
```

---

# Phase 5 — Core Agents

### Goal
Build each specialized agent independently before connecting them to LangGraph.

Implement in this order:

1. Idea Validator
2. Market Research
3. Competitor Analysis
4. Business Model
5. Financial
6. MVP Planner
7. GTM
8. Verdict

For each agent:

```text
Input
 ↓
Required Context
 ↓
Prompt
 ↓
Gemini
 ↓
Structured Output
 ↓
Validation
```

### Deliverable

Every core agent produces a validated structured result independently.

---

# Phase 6 — LangGraph Workflow

### Goal
Connect the agents into the main multi-agent workflow.

### Tasks

- Define shared startup state.
- Create graph nodes.
- Connect agents to nodes.
- Define graph edges.
- Implement execution order.
- Persist important intermediate outputs.
- Track analysis status.
- Handle node failures.

### Initial workflow

```text
START
  ↓
Idea Validator
  ↓
Market Research ─────┐
                     ├──→ Business Model
Competitor Analysis ─┘
                         ↓
                     Financial
                         ↓
                        MVP
                         ↓
                        GTM
                         ↓
                ┌────────┴────────┐
                ↓                 ↓
          Landing Page       Pitch Deck
                └────────┬────────┘
                         ↓
                    Final Report
                         ↓
                      Verdict
                         ↓
                        END
```

### Deliverable

A startup can be processed through the complete AI analysis workflow.

---

# Phase 7 — Web Research

### Goal
Provide current external information to research-heavy agents.

### Tasks

- Integrate Tavily.
- Build research service.
- Normalize search results.
- Extract relevant web content.
- Preserve source information.
- Integrate research into:
  - Market Research
  - Competitor Analysis

### Deliverable

Research agents can use current web information with source context.

---

# Phase 8 — RAG

### Goal
Add persistent startup/business knowledge retrieval.

### Tasks

- Prepare knowledge-base documents.
- Implement document ingestion.
- Extract and chunk documents.
- Generate embeddings.
- Store vectors in Supabase pgvector.
- Implement retrieval.
- Integrate RAG service with relevant agents.

### Flow

```text
Documents
 ↓
Extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
pgvector
```

Runtime:

```text
Agent
 ↓
RAG Service
 ↓
Retriever
 ↓
pgvector
 ↓
Relevant Context
```

### Deliverable

Agents can combine startup information, web research, and RAG knowledge.

---

# Phase 9 — Financial Engine

### Goal
Separate deterministic financial calculations from LLM reasoning.

### Tasks

- Define financial assumptions.
- Calculate revenue.
- Calculate costs.
- Project customers.
- Calculate break-even.
- Calculate profit.
- Implement financial scenarios.
- Connect calculations to the Financial Agent.

### Architecture

```text
Financial Agent
      ↓
Financial Assumptions
      ↓
Python Calculation Engine
      ↓
Calculated Results
```

### Deliverable

Financial projections are reproducible and clearly labeled as estimates.

---

# Phase 10 — Artifact Generation

### Goal
Generate useful startup deliverables.

### PDF Report

- Define report structure.
- Generate PDF with ReportLab.
- Upload to Supabase Storage.
- Store artifact metadata.

### Pitch Deck

- Define slide structure.
- Create PPTX generation logic.
- Populate startup data.
- Upload to Supabase Storage.

### Landing Page

- Generate structured landing-page content.
- Generate HTML/CSS.
- Store the generated artifact.

### Deliverable

Users can generate:

```text
Startup Report
Pitch Deck
Landing Page
```

---

# Phase 11 — Startup AI Consultant

### Goal
Build a persistent startup-specific AI consultant.

### Tasks

- Implement chat sessions.
- Store chat messages.
- Build chat workflow.
- Retrieve startup context.
- Retrieve relevant agent outputs.
- Integrate RAG where appropriate.
- Integrate Gemini.

### Flow

```text
User Question
     ↓
Chat Workflow
     ↓
Startup Context
     ↓
Relevant Analysis
     ↓
RAG / Research
     ↓
Gemini
     ↓
Answer
```

### Deliverable

Users can continuously discuss and refine their startup using persistent context.

---

# Phase 12 — Selective Re-execution

### Goal
Implement IDEON's main advanced agentic feature.

### Tasks

- Define dependencies between outputs.
- Build dependency map.
- Detect changed startup fields.
- Perform impact analysis.
- Identify affected agents.
- Invalidate stale outputs.
- Re-run affected nodes.
- Preserve unaffected outputs.
- Recalculate downstream outputs.
- Update dependent artifacts.
- Track analysis versions.

### Example

```text
Target Market Changed
        ↓
Impact Analysis
        ↓
Affected Components
        ↓
Selective Re-execution
        ↓
Updated Results
```

### Deliverable

Changing one startup assumption does not unnecessarily restart the entire analysis.

---

# Phase 13 — Realtime Progress

### Goal
Provide live analysis progress to the frontend.

IDEON will use **Supabase Realtime** instead of maintaining a custom FastAPI WebSocket layer.

### Tasks

- Persist analysis status/progress.
- Update current agent and status during workflow execution.
- Configure Supabase Realtime subscriptions.
- Connect the frontend to relevant database changes.

### Flow

```text
LangGraph
    ↓
Progress Update
    ↓
Supabase PostgreSQL
    ↓
Supabase Realtime
    ↓
Next.js
```

### Deliverable

Users can see analysis progress without a custom WebSocket service.

---

# Phase 14 — Next.js Frontend

### Goal
Build the complete user-facing application.

### User-facing features

- Landing page
- Login / Signup
- Dashboard
- Startup creation
- Founder profile
- Analysis configuration
- Analysis progress
- Results
- Artifact downloads
- Startup chat
- Startup editing
- Re-execution status

### Architecture rule

```text
Next.js
   ↓
FastAPI
   ↓
Backend
```

The frontend must not directly access Gemini, Tavily, or the database.

### Deliverable

A complete frontend connected to the backend API.

---

# Phase 15 — Testing and Hardening

### Unit Tests

Test:

- Agents
- Graph nodes
- Workflows
- Services
- Financial calculations
- Dependency analysis
- Repositories

### Integration Tests

Test:

- API
- Database
- Authentication
- Workflow execution
- Persistence

### Workflow Tests

Test:

- Complete analysis
- Node failures
- State updates
- Selective re-execution
- Dependency propagation

### Validation

Verify:

- Structured output schemas
- Required fields
- Value ranges
- User ownership
- Error handling

LLM tests should validate structured behavior rather than exact generated wording.

### Deliverable

A stable backend with reliable core workflows and meaningful test coverage.

---

# Phase 16 — Deployment

### Goal
Deploy a production-ready version.

### Tasks

- Add Docker configuration.
- Configure production environment variables.
- Build backend container.
- Build frontend.
- Configure Supabase.
- Configure Supabase Storage.
- Configure deployment platform.
- Configure HTTPS.
- Configure logging.
- Run production smoke tests.

### Deliverable

A publicly accessible IDEON application.

---

# Phase 17 — Final Polish

### Goal
Prepare IDEON for demonstration and portfolio use.

### Tasks

- Fix remaining bugs.
- Improve UI/UX.
- Optimize slow workflows.
- Improve error handling.
- Review security.
- Remove unused dependencies.
- Improve API documentation.
- Complete README.
- Add architecture documentation.
- Prepare final demo.

---

# 3-Month Development Plan

## Month 1 — Core AI System

### Weeks 1–2

- Project foundation
- Database
- Authentication
- Core API

### Weeks 3–4

- Gemini integration
- Structured outputs
- Core agents
- LangGraph state
- Initial workflow

### Milestone

> A user can submit a startup idea and receive a complete core multi-agent analysis.

---

## Month 2 — Research and Startup Intelligence

### Weeks 5–6

- Tavily research
- Web extraction
- RAG ingestion
- pgvector
- Retrieval

### Weeks 7–8

- Financial engine
- PDF report
- Pitch deck
- Landing page
- Verdict refinement

### Milestone

> IDEON can produce research-backed startup analysis and useful startup artifacts.

---

## Month 3 — Advanced Features and Product

### Weeks 9–10

- Startup Chat
- Dependency map
- Impact analysis
- Selective re-execution

### Week 11

- Next.js frontend
- Supabase Realtime
- Complete user workflow

### Week 12

- Testing
- Bug fixing
- Docker
- Deployment
- Documentation
- Final demo

### Final Milestone

> A user can create a startup, run a multi-agent analysis, view results and artifacts, consult the AI, change assumptions, selectively re-run affected components, and receive updated results.

---

# Development Priorities

If time becomes limited, prioritize:

```text
1. Core LangGraph workflow
2. Structured agent outputs
3. Database/state persistence
4. Web research
5. Selective re-execution
6. RAG
7. Financial engine
8. Startup chat
9. Artifact generation
10. Frontend polish
```

Do not add additional features at the expense of workflow reliability.

---

# Definition of Done

IDEON is ready for the final demonstration when a user can:

```text
Create Account
    ↓
Create Startup
    ↓
Enter Founder Profile
    ↓
Configure Analysis
    ↓
Run AI Analysis
    ↓
View Progress
    ↓
View Multi-Agent Results
    ↓
Receive Final Verdict
    ↓
Generate / Download Artifacts
    ↓
Chat with AI Consultant
    ↓
Modify Startup Assumption
    ↓
Run Impact Analysis
    ↓
Re-run Only Affected Components
    ↓
View Updated Results
```

At completion, IDEON should demonstrate:

**Multi-Agent AI + LangGraph + Gemini + RAG + Web Research + Structured Outputs + PostgreSQL/pgvector + Artifact Generation + Selective Re-execution.**


