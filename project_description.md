# IDEON — AI Startup Builder

## 1. Overview

**IDEON** is an Agentic AI platform that transforms a startup idea into a structured, research-backed, and continuously improvable startup strategy.

Instead of producing a single chatbot response, IDEON maintains a structured **Startup State** and uses specialized AI agents orchestrated with **LangGraph** to analyze the startup from multiple perspectives.

The system combines:

- Multi-Agent AI
- Generative AI
- LangGraph
- RAG
- Live web research
- Structured LLM outputs
- Evidence-backed analysis
- Assumption tracking
- Contradiction detection
- Validation experiments
- Selective re-execution
- Automated artifact generation

IDEON is designed as a **Python modular monolith** with a FastAPI backend and a Next.js frontend.

---

# 2. Core Concept

The central idea behind IDEON is a **living, evidence-backed model of a startup**.

A startup is not treated as a static prompt. It is represented by structured information such as:

- Startup idea
- Problem
- Solution
- Target customers
- Market
- Pricing
- Business model
- Financial assumptions
- MVP
- GTM strategy
- Founder profile
- Evidence
- Risks
- Assumptions

Agents continuously analyze this state and update relevant outputs.

```text
                 STARTUP STATE
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Market      Product     Business
     Assumptions  Assumptions  Assumptions
          │           │           │
          └───────────┼───────────┘
                      ↓
               Agent Analysis
                      ↓
                Updated State
```

---

# 3. User Perspective

## User Workflow

```text
Landing Page
    ↓
Login / Signup
    ↓
Dashboard
    ↓
Create Startup
    ↓
Enter Startup Information
    ↓
Enter Founder Profile
    ↓
Configure Analysis
    ↓
Run AI Analysis
    ↓
View Analysis Progress
    ↓
View Startup Results
    ↓
Review Risks & Assumptions
    ↓
Generate Artifacts
    ↓
Chat with AI Consultant
    ↓
Run Validation Experiments
    ↓
Modify Startup
    ↓
Re-run Affected Analysis
```

## Startup Information

Users can provide:

- Startup name
- Startup idea
- Problem
- Proposed solution
- Industry
- Target market
- Country/region
- Pricing assumptions
- Initial business assumptions

## Founder Profile

Users can provide:

- Role
- Skills
- Experience
- Team size
- Budget
- Available time

---

# 4. AI Analysis

IDEON uses specialized components for different startup-building tasks.

### Idea Validator

Evaluates:

- Problem strength
- Solution quality
- Market potential
- Technical feasibility
- Differentiation
- Monetization potential
- Key risks

Produces structured validation results, recommendations, and confidence.

### Market Research

Analyzes:

- Target customers
- Customer needs
- TAM, SAM, SOM
- Market trends
- Industry trends
- Growth opportunities

Uses live web research and RAG.

### Competitor Analysis

Analyzes:

- Direct competitors
- Indirect competitors
- Pricing
- Features
- Strengths
- Weaknesses
- Competitive gaps
- Differentiation opportunities

### Business Model

Generates:

- Customer segments
- Value proposition
- Revenue model
- Revenue streams
- Pricing strategy
- Cost structure
- Business Model Canvas

### Financial Analysis

Generates assumption-based:

- Customer projections
- Revenue projections
- Cost projections
- Break-even estimates
- Profit estimates
- Financial scenarios

Where possible, the LLM proposes assumptions and deterministic Python code performs calculations.

Financial outputs are explicitly treated as **estimates, not guaranteed forecasts**.

### MVP Planner

Generates:

- Core MVP features
- Feature priorities
- Features to postpone
- Development phases
- Technical requirements
- Estimated timeline
- Recommended team

### GTM Strategy

Generates:

- Target customer
- Acquisition channels
- Marketing strategy
- Launch strategy
- Pricing strategy
- Customer acquisition plan
- Growth strategy

### Verdict

Synthesizes the complete startup analysis and produces:

- Overall score
- Recommendation
- Strengths
- Risks
- Opportunities
- Confidence
- Recommended next steps
- Key assumptions to validate

The verdict is decision support, not a guarantee of startup success.

---

# 5. Evidence and Assumptions

A key feature of IDEON is distinguishing between different types of information.

Important claims can be classified as:

```text
FACT
ASSUMPTION
ESTIMATE
INFERENCE
RECOMMENDATION
```

An assumption can contain:

```text
Assumption
    ↓
Confidence
    ↓
Supporting Evidence
    ↓
Impact
    ↓
Validation Status
```

Example:

```text
Target Market:
College Students

Confidence:
Medium

Impact:
High

Evidence:
Market research + competitor data

Status:
Needs validation
```

This allows IDEON to identify which assumptions are weak, important, or unsupported.

---

# 6. Evidence Layer

Important analysis claims should be connected to evidence where possible.

Example:

```text
Claim:
Competitors charge approximately ₹499/month.

Evidence:
Competitor pricing pages

Source:
Web research

Confidence:
High
```

This allows IDEON to distinguish evidence-backed findings from assumptions and AI-generated estimates.

RAG provides relatively stable knowledge, while live web research provides current external evidence.

---

# 7. Contradiction Detection

IDEON can detect inconsistencies between different parts of the startup state.

Example:

```text
Founder Budget:
₹50,000

Financial Plan:
Marketing Budget = ₹2,00,000
```

IDEON can flag:

> Proposed marketing expenditure exceeds the stated available budget.

Another example:

```text
Target Customer:
Price-sensitive students

Pricing:
₹4,999/month
```

IDEON can flag this as a potential pricing-segment mismatch.

Contradiction detection helps prevent the system from generating internally inconsistent startup plans.

---

# 8. Validation Experiments

IDEON can convert uncertain assumptions into practical validation experiments.

Example:

```text
Hypothesis:
Students will pay ₹299/month.

Experiment:
Create a landing page and test demand.

Success Criteria:
Defined signup or payment-intent threshold.

Time:
7 days

Decision:
Continue / Modify / Reject
```

This moves IDEON beyond generating recommendations toward helping founders **test the assumptions behind those recommendations**.

---

# 9. Selective Re-execution

A core Agentic AI feature is **dependency-aware selective re-execution**.

When a user changes an assumption, IDEON identifies affected outputs instead of restarting the entire workflow.

Example:

```text
Target Market
Students
    ↓
Working Professionals
```

The system performs:

```text
Change
 ↓
Impact Analysis
 ↓
Dependency Map
 ↓
Affected Components
 ↓
Selective Re-execution
```

Potentially affected components:

```text
Market Research       → RE-RUN
Competitor Analysis   → RE-RUN
Business Model        → RE-RUN
Financial Analysis    → RE-RUN
MVP                   → RE-RUN
GTM                   → RE-RUN
Landing Page          → UPDATE
Pitch Deck            → UPDATE
Verdict               → RE-RUN
```

Unaffected outputs are preserved.

This makes IDEON a **stateful, dependency-aware multi-agent system** rather than a collection of independent LLM calls.

---

# 10. Startup AI Consultant

After analysis, users can continuously discuss their startup with a persistent AI consultant.

Example questions:

```text
Should I reduce my pricing?

Which competitor is my biggest threat?

Should I target students or working professionals?

What feature should I remove from my MVP?

Which assumption should I validate first?
```

The consultant uses:

- Startup State
- Founder Profile
- Agent Outputs
- Market Research
- Competitor Analysis
- Business Model
- Financial assumptions
- MVP
- GTM
- Evidence
- RAG knowledge

The consultant is startup-specific rather than a generic chatbot.

---

# 11. Developer Architecture

IDEON is a **Python modular monolith**.

```text
Next.js
   ↓
FastAPI
   ↓
Services
   ↓
Workflows
   ↓
LangGraph
   ↓
Specialized Agents
   ↓
Gemini
   ├── RAG
   └── Web Research
   ↓
Repositories
   ↓
SQLModel / SQLAlchemy
   ↓
asyncpg
   ↓
Supabase PostgreSQL
```

The frontend communicates only with FastAPI.

---

# 12. Layer Responsibilities

| Layer | Responsibility |
|---|---|
| `api/` | HTTP endpoints and request/response handling |
| `services/` | Application and business logic |
| `workflows/` | LangGraph workflow orchestration |
| `agents/` | Specialized AI reasoning |
| `schemas/` | Pydantic data contracts |
| `db/models/` | Database/ORM models |
| `db/repositories/` | ORM queries and persistence |
| `core/` | Configuration and shared backend infrastructure |
| `tests/` | Backend unit and integration tests |

Artifact generation is treated as application/service functionality rather than requiring every artifact generator to be an autonomous agent.

---

# 13. Main LangGraph Workflow

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

LangGraph manages:

- Shared startup state
- Nodes
- Edges
- Routing
- Execution order
- State updates
- Conditional execution
- Selective re-execution

---

# 14. RAG System

IDEON uses **Supabase PostgreSQL with pgvector** for semantic retrieval.

Potential knowledge sources:

- Startup guides
- YC resources
- Business frameworks
- Entrepreneurship documents
- Startup case studies

### Ingestion

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

### Runtime

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

---

# 15. Web Research

Tavily provides live external research.

```text
Agent
  ↓
Research Service
  ↓
Tavily
  ↓
Search Results
  ↓
Content Extraction
  ↓
Research Context
```

Market Research and Competitor Analysis are the primary research-heavy components.

---

# 16. Database and Authentication

Supabase provides:

- PostgreSQL
- pgvector
- Authentication
- Storage
- Realtime

Database access:

```text
FastAPI
   ↓
SQLModel
   ↓
SQLAlchemy Async
   ↓
asyncpg
   ↓
Supabase PostgreSQL
```

Core entities include:

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

The system can later extend the data model with:

```text
StartupAssumption
Evidence
ValidationExperiment
Contradiction
```

Authentication uses Supabase Auth with backend-side authorization and startup ownership checks.

---

# 17. Realtime Progress

IDEON uses **Supabase Realtime** instead of maintaining a custom FastAPI WebSocket layer.

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

---

# 18. Artifact Generation

IDEON can generate:

- PDF startup reports
- PowerPoint pitch decks
- Landing-page output

```text
Structured Analysis
       ↓
Artifact Service
       ↓
Supabase Storage
       ↓
Artifact Metadata
```

Artifacts are outputs of the intelligence system, not the core intelligence itself.

---

# 19. Technology Stack

### Backend

- Python
- FastAPI
- Pydantic
- Pydantic Settings
- SQLModel
- SQLAlchemy
- asyncpg
- Alembic

### Agentic AI

- LangGraph
- LangChain
- Google Gemini

### RAG / Research

- Supabase pgvector
- Tavily

### Infrastructure

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime

### Artifacts

- ReportLab
- python-pptx

### Frontend

- Next.js
- React
- TypeScript

---

# 20. Architecture Rules

1. The frontend communicates only with FastAPI.
2. LangGraph controls workflow orchestration.
3. Agents perform specialized AI reasoning.
4. The Startup State is the central source of application context.
5. Services coordinate application logic.
6. Repositories handle database operations.
7. Pydantic schemas define structured contracts.
8. RAG provides persistent knowledge retrieval.
9. Tavily provides live web research.
10. Deterministic Python code handles calculations where appropriate.
11. Important claims should retain evidence or clearly state when they are assumptions or estimates.
12. Supabase provides database, authentication, storage, and realtime infrastructure.
13. Important intermediate results are persisted.
14. Secrets remain server-side.
15. Selective re-execution recalculates only affected components.
16. Artifacts are generated from structured startup outputs.
17. The project remains a modular monolith.

---

# 21. Final Definition

**IDEON is a stateful, evidence-backed multi-agent AI platform that helps founders evaluate, plan, and iteratively refine startup ideas.**

Its core system combines:

```text
Startup State
      +
Multi-Agent AI
      +
LangGraph
      +
Gemini
      +
RAG
      +
Live Web Research
      +
Evidence & Assumption Tracking
      +
Contradiction Detection
      +
Validation Experiments
      +
Selective Re-execution
      +
Artifact Generation
```

The defining loop is:

```text
Startup Idea
    ↓
Build Startup State
    ↓
Research + Multi-Agent Analysis
    ↓
Evidence & Assumption Evaluation
    ↓
Risks / Contradictions
    ↓
Strategic Verdict
    ↓
Recommended Validation Experiments
    ↓
Founder Action / New Information
    ↓
Update Startup State
    ↓
Impact Analysis
    ↓
Selective Re-execution
    ↓
Updated Startup Strategy
```

The primary technical goal is to build a **reliable, stateful, evidence-aware, modular multi-agent AI system** rather than simply a collection of LLM prompts.



