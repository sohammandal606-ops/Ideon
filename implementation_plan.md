# IDEON — Implementation Plan

## Development Strategy

IDEON will be built as a **Python modular monolith** with a FastAPI backend and a Next.js frontend.

The implementation should prioritize the core differentiator:

> **A stateful, evidence-backed startup model that can detect dependencies and selectively re-execute affected analysis when assumptions change.**

Build incrementally rather than creating the entire architecture at once.

```text
Foundation
    ↓
Database + Auth
    ↓
Core API
    ↓
Startup State
    ↓
LLM Infrastructure
    ↓
First Agent
    ↓
LangGraph Workflow
    ↓
Research + RAG
    ↓
Evidence + Assumptions
    ↓
Contradiction Detection
    ↓
Validation Experiments
    ↓
Selective Re-execution
    ↓
Artifacts + Chat
    ↓
Next.js + Realtime
    ↓
Testing + Deployment
```

---

# Phase 1 — Project Foundation

### Goal

Create a clean, runnable backend foundation.

### Tasks

- Configure Python 3.12+.
- Configure `uv`.
- Set up `pyproject.toml`.
- Generate and commit `uv.lock`.
- Configure `.env` and `.env.example`.
- Set up FastAPI.
- Create `/api/v1/`.
- Configure application settings with Pydantic Settings.
- Add basic logging and exception handling.
- Add a health endpoint.

### Deliverable

A minimal FastAPI application that runs successfully.

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
- Use `asyncpg` as the PostgreSQL driver.
- Configure Alembic.
- Create initial database models.
- Create repository layer.
- Integrate Supabase Auth.
- Implement authentication dependencies.
- Implement startup ownership and authorization.

### Initial entities

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

Build the application API before adding complex AI functionality.

### Tasks

Implement endpoints for:

- Authentication/user information
- Startups
- Founder profiles
- Startup configuration
- Analysis runs
- Artifacts
- Chat sessions/messages

Follow:

```text
API
 ↓
Service
 ↓
Repository
 ↓
Database
```

### Deliverable

The backend can manage the startup lifecycle without AI.

---

# Phase 4 — Startup State

### Goal

Create the central structured representation of a startup.

The **Startup State** becomes the main context shared across the AI system.

### State should represent

- Startup idea
- Problem
- Solution
- Target customer
- Market
- Pricing
- Business model
- Financial assumptions
- MVP
- GTM
- Founder constraints
- Analysis outputs
- Risks
- Evidence
- Assumptions

### Tasks

- Define the shared state schema.
- Separate user-provided information from generated information.
- Define state update rules.
- Define versioning requirements.
- Ensure state can be persisted and reconstructed.

### Deliverable

A startup can be represented as a structured state independent of the UI.

---

# Phase 5 — LLM Infrastructure

### Goal

Create reusable and reliable Gemini integration.

### Tasks

- Configure Google Gemini.
- Create centralized LLM client.
- Configure model settings.
- Create prompt management utilities.
- Implement structured output handling.
- Define Pydantic output contracts.
- Implement validation and error handling.
- Add retry handling where appropriate.

### Standard agent flow

```text
Startup State / Context
        ↓
Prompt
        ↓
Gemini
        ↓
Structured Output
        ↓
Pydantic Validation
        ↓
State Update
```

### Deliverable

A reusable LLM infrastructure that agents can use consistently.

---

# Phase 6 — Core Agents

### Goal

Implement the primary reasoning components independently before connecting the complete workflow.

Implement in this order:

1. Idea Validator
2. Market Research
3. Competitor Analysis
4. Business Model
5. Financial Analysis
6. MVP Planner
7. GTM
8. Verdict

For each agent:

```text
Input Context
     ↓
Reasoning
     ↓
Structured Output
     ↓
Validation
```

### Important rule

Agents should produce **structured outputs**, not large unstructured text blobs.

### Deliverable

Each core agent can run independently and return a validated result.

---

# Phase 7 — Initial LangGraph Workflow

### Goal

Connect the core agents into a stateful workflow.

### Tasks

- Define LangGraph state.
- Create graph nodes.
- Connect agents to nodes.
- Define execution order.
- Add conditional routing where necessary.
- Persist important outputs.
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
                      Verdict
                         ↓
                        END
```

Artifact generation and other secondary features should not block the core workflow.

### Deliverable

A user can submit a startup and receive a complete structured analysis.

---

# Phase 8 — Live Web Research

### Goal

Provide current external information to research-heavy components.

### Tasks

- Integrate Tavily.
- Create research service.
- Normalize search results.
- Extract useful page content.
- Preserve source URLs and metadata.
- Add source information to research outputs.
- Integrate research into:
  - Market Research
  - Competitor Analysis

### Deliverable

Research-heavy agents can produce current, source-aware findings.

---

# Phase 9 — RAG

### Goal

Add persistent knowledge retrieval.

### Tasks

- Prepare knowledge-base documents.
- Implement ingestion.
- Extract documents.
- Chunk documents.
- Generate embeddings.
- Store vectors in Supabase pgvector.
- Implement retrieval.
- Integrate retrieved context into relevant agents.

### Flow

```text
Knowledge Base
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
Retriever
 ↓
Relevant Knowledge
 ↓
Agent Context
```

### Deliverable

IDEON can combine startup state, live research, and persistent domain knowledge.

---

# Phase 10 — Evidence + Assumption System

### Goal

Make the startup analysis evidence-aware.

### Core distinction

Important information should be classified as:

```text
FACT
ASSUMPTION
ESTIMATE
INFERENCE
RECOMMENDATION
```

### Tasks

Introduce concepts such as:

```text
StartupAssumption
Evidence
```

Track for important assumptions:

- Value
- Confidence
- Impact
- Supporting evidence
- Validation status
- Source
- Last updated

### Example

```text
Assumption:
Students will pay ₹299/month.

Confidence:
Medium

Impact:
High

Evidence:
Competitor pricing + market research

Validation:
Pending
```

### Deliverable

IDEON can identify important assumptions and distinguish them from evidence-backed findings.

---

# Phase 11 — Deterministic Financial Engine

### Goal

Keep financial calculations reliable and reproducible.

### Tasks

- Define financial assumptions.
- Implement customer projections.
- Implement revenue calculations.
- Implement cost calculations.
- Implement break-even calculations.
- Implement profit calculations.
- Support scenarios.
- Validate numerical inputs.
- Connect the Financial Agent to the calculation engine.

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

The LLM proposes or explains assumptions; Python performs deterministic calculations.

### Deliverable

Financial results are reproducible and clearly labeled as estimates.

---

# Phase 12 — Contradiction + Risk Detection

### Goal

Detect inconsistencies within the Startup State.

### Examples

```text
Founder Budget = ₹50,000
Marketing Budget = ₹2,00,000
```

or:

```text
Target Customer = Price-sensitive students
Price = ₹4,999/month
```

### Tasks

- Define contradiction types.
- Compare related startup-state fields.
- Detect constraint violations.
- Detect business-model inconsistencies.
- Detect financial inconsistencies.
- Store contradiction results.
- Assign severity and confidence.

### Deliverable

IDEON can flag important inconsistencies instead of silently producing contradictory outputs.

---

# Phase 13 — Validation Experiments

### Goal

Convert uncertain assumptions into practical validation actions.

### Tasks

- Identify high-impact, low-confidence assumptions.
- Generate testable hypotheses.
- Generate validation experiments.
- Define success criteria.
- Define experiment duration.
- Define expected decision outcomes.

### Example

```text
Hypothesis
    ↓
Experiment
    ↓
Success Criteria
    ↓
Real-World Result
    ↓
Continue / Modify / Reject
```

### Deliverable

IDEON can recommend concrete experiments for validating critical startup assumptions.

---

# Phase 14 — Dependency Map + Impact Analysis

### Goal

Build the dependency system required for selective re-execution.

### Tasks

Define dependencies between:

- Startup fields
- Assumptions
- Research outputs
- Agent outputs
- Derived recommendations
- Artifacts

Example:

```text
Target Market
    ↓
Market Research
    ↓
Business Model
    ↓
Financial Analysis
    ↓
GTM
    ↓
Verdict
```

### Impact analysis

When a value changes:

```text
Changed Field
     ↓
Dependency Graph
     ↓
Affected Outputs
     ↓
Execution Plan
```

### Deliverable

IDEON can determine which outputs are stale after a startup change.

---

# Phase 15 — Selective Re-execution

### Goal

Implement the core advanced feature of IDEON.

### Tasks

- Detect changed startup state.
- Compare state versions.
- Run impact analysis.
- Identify affected agents.
- Invalidate stale outputs.
- Re-run only affected LangGraph nodes.
- Preserve unaffected outputs.
- Recalculate downstream dependencies.
- Update analysis versions.
- Prevent stale outputs from being presented as current.

### Example

```text
Target Market Changed
        ↓
Impact Analysis
        ↓
Market Research       → RE-RUN
Competitor Analysis   → RE-RUN
Business Model        → RE-RUN
Financial Analysis    → RE-RUN
MVP                   → RE-RUN
GTM                   → RE-RUN
Verdict               → RE-RUN
```

### Deliverable

Changing one important assumption does not require restarting the entire analysis.

---

# Phase 16 — Startup AI Consultant

### Goal

Provide a persistent startup-specific AI consultant.

### Tasks

- Implement chat sessions.
- Persist messages.
- Build chat workflow.
- Retrieve Startup State.
- Retrieve relevant agent outputs.
- Retrieve evidence and assumptions.
- Integrate RAG where appropriate.
- Integrate Gemini.
- Keep answers grounded in the startup context.

### Flow

```text
User Question
      ↓
Chat Workflow
      ↓
Startup State
      ↓
Relevant Outputs
      ↓
Evidence / RAG
      ↓
Gemini
      ↓
Answer
```

### Deliverable

Users can continuously discuss and refine their startup.

---

# Phase 17 — Artifact Generation

### Goal

Generate useful outputs from structured startup intelligence.

### Artifacts

- PDF startup report
- PowerPoint pitch deck
- Landing-page output

### Architecture

```text
Structured Startup State
        ↓
Artifact Service
        ↓
Generated Artifact
        ↓
Supabase Storage
        ↓
Artifact Metadata
```

Artifacts should consume structured outputs rather than independently performing startup reasoning.

### Deliverable

Users can generate and retrieve useful startup artifacts.

---

# Phase 18 — Realtime Progress

### Goal

Show live analysis progress in the frontend.

IDEON will use **Supabase Realtime** rather than a custom FastAPI WebSocket layer.

### Tasks

- Persist analysis status.
- Persist current agent/progress information.
- Update progress during LangGraph execution.
- Configure Supabase Realtime.
- Subscribe from the frontend.

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

Users can see analysis progress in real time.

---

# Phase 19 — Next.js Frontend

### Goal

Build the complete user-facing application.

### Main screens

- Landing page
- Login / Signup
- Dashboard
- Create Startup
- Founder Profile
- Analysis Configuration
- Analysis Progress
- Results
- Assumptions / Evidence
- Validation Experiments
- Artifacts
- Startup Chat
- Edit Startup
- Re-execution status

### Architecture

```text
Next.js
   ↓
FastAPI
   ↓
Backend
```

The frontend must not directly access Gemini, Tavily, or PostgreSQL.

### Deliverable

A complete user-facing IDEON application.

---

# Phase 20 — Testing and Hardening

## Unit Tests

Test:

- Agents
- Graph nodes
- Services
- Repositories
- Financial calculations
- Assumption logic
- Contradiction detection
- Dependency analysis
- Impact analysis

## Integration Tests

Test:

- API
- Database
- Authentication
- LangGraph workflows
- Persistence
- Selective re-execution

## Workflow Tests

Test:

- Complete analysis
- Failed agent
- State updates
- Dependency propagation
- Changed assumptions
- Partial re-execution
- Stale-output prevention

## LLM Tests

Validate:

- Structured output schemas
- Required fields
- Valid values
- Expected behavior

Do not rely on exact generated prose.

### Deliverable

A stable backend with meaningful test coverage around the core intelligence loop.

---

# Phase 21 — Deployment

### Goal

Deploy a production-ready version.

### Tasks

- Add Docker configuration.
- Configure production environment variables.
- Build backend image.
- Build frontend.
- Configure Supabase.
- Configure Storage.
- Configure Realtime.
- Configure deployment platform.
- Configure HTTPS.
- Configure logging.
- Run production smoke tests.

### Deliverable

A publicly accessible IDEON application.

---

# 3-Month Development Plan

## Month 1 — Foundation + Core AI

### Weeks 1–2

- Project foundation
- Database
- Authentication
- Core API
- Startup State

### Weeks 3–4

- Gemini integration
- Structured outputs
- Idea Validator
- Market Research
- Competitor Analysis
- Initial LangGraph workflow

### Milestone

> A user can create a startup and receive a structured multi-agent analysis.

---

## Month 2 — Intelligence Layer

### Weeks 5–6

- Remaining core agents
- Tavily research
- RAG
- pgvector
- Evidence system
- Assumption tracking

### Weeks 7–8

- Financial engine
- Contradiction detection
- Risk analysis
- Validation experiments
- Dependency map
- Impact analysis

### Milestone

> IDEON can analyze a startup using research, evidence, assumptions, deterministic calculations, and consistency checks.

---

## Month 3 — Core Differentiator + Product

### Weeks 9–10

- Selective re-execution
- Startup AI Consultant
- Artifact generation
- Analysis versioning

### Week 11

- Next.js frontend
- Supabase Realtime
- Complete user workflow

### Week 12

- Testing
- Security review
- Bug fixing
- Docker
- Deployment
- Documentation
- Final demo

### Final Milestone

> A user can create a startup, run a research-backed multi-agent analysis, inspect assumptions and evidence, identify risks and contradictions, generate validation experiments, change an assumption, selectively re-run affected analysis, and receive an updated startup strategy.

---

# Development Priorities

If time becomes limited, prioritize the following:

```text
1. Startup State
2. Core LangGraph workflow
3. Structured agent outputs
4. Database persistence
5. Web research
6. Assumption + evidence system
7. Dependency map
8. Selective re-execution
9. Contradiction detection
10. Financial engine
11. Startup chat
12. RAG
13. Artifact generation
14. Frontend polish
```

The **Startup State → Impact Analysis → Selective Re-execution** loop is the highest-priority feature.

Do not sacrifice this core architecture to add more superficial AI features.

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
Configure Startup
    ↓
Run Multi-Agent Analysis
    ↓
View Progress
    ↓
Review Results
    ↓
Inspect Evidence & Assumptions
    ↓
See Risks / Contradictions
    ↓
Receive Strategic Verdict
    ↓
Generate Validation Experiments
    ↓
Chat with AI Consultant
    ↓
Change an Important Assumption
    ↓
Run Impact Analysis
    ↓
Re-run Only Affected Components
    ↓
View Updated Startup Strategy
    ↓
Generate / Download Artifacts
```

At completion, IDEON should demonstrate:

**Startup State + Multi-Agent AI + LangGraph + Gemini + RAG + Live Research + Evidence + Assumption Tracking + Contradiction Detection + Validation Experiments + Selective Re-execution + PostgreSQL/pgvector + Artifact Generation.**



