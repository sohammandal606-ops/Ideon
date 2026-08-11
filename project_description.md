# IDEON — AI Startup Builder

## 1. Project Overview

**IDEON** is an Agentic AI platform that helps users transform a startup idea into a structured, research-backed, and continuously improvable startup plan.

Instead of producing one large chatbot response, IDEON uses multiple specialized AI agents orchestrated through **LangGraph**. Each agent handles a specific startup-building task, while a shared startup state connects their outputs.

The system combines:

- Multi-Agent AI
- Generative AI
- LangGraph
- RAG
- Live web research
- Structured LLM outputs
- PostgreSQL + pgvector
- Automated artifact generation
- Dependency-aware selective re-execution

IDEON is implemented as a **Python modular monolith** with a FastAPI backend and a Next.js frontend.

---

# 2. User Perspective

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
Start AI Analysis
    ↓
View Analysis Progress
    ↓
View Startup Results
    ↓
Generate Artifacts
    ↓
Chat with AI Consultant
    ↓
Modify Startup
    ↓
Re-run Affected Analysis
```

## Startup Information

Users provide information such as:

- Startup name
- Startup idea
- Problem
- Proposed solution
- Industry
- Target market
- Country/region
- Initial assumptions

## Founder Profile

Users can provide:

- Role
- Skills
- Experience
- Team size
- Budget
- Available time

---

# 3. AI Analysis

IDEON uses specialized agents for different startup-building tasks.

### Idea Validator

Evaluates:

- Problem strength
- Solution quality
- Market potential
- Technical feasibility
- Differentiation
- Monetization potential
- Risks

Produces a validation score, strengths, weaknesses, risks, recommendations, and confidence.

### Market Research

Analyzes:

- Target customers
- Customer needs
- TAM, SAM, SOM
- Market trends
- Industry trends
- Growth opportunities

Uses **live web research and RAG**.

### Competitor Analysis

Analyzes:

- Direct competitors
- Indirect competitors
- Pricing
- Features
- Strengths and weaknesses
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

Generates estimated:

- Pricing assumptions
- Customer projections
- Revenue projections
- Cost projections
- Break-even estimates
- Profit estimates
- Financial scenarios

Financial values are **AI-generated estimates based on explicit assumptions**, not guaranteed forecasts.

Where possible, the LLM provides assumptions while deterministic Python code performs calculations.

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

### Landing Page

Generates:

- Hero section
- Problem
- Solution
- Features
- Pricing
- CTA
- FAQ

### Pitch Deck

Generates:

1. Cover
2. Problem
3. Solution
4. Product
5. Market
6. Competition
7. Business Model
8. Go-To-Market
9. Financial Projection
10. Roadmap
11. Funding Ask

### Final Report

Combines the analysis into:

- Executive summary
- Idea validation
- Market research
- Competitor analysis
- Business model
- Financial analysis
- MVP
- GTM
- Risks
- Recommendations
- Final verdict

### Verdict

Produces:

- Overall score
- Recommendation
- Strengths
- Risks
- Opportunities
- Next steps
- Confidence score

The verdict is decision support, not a guarantee of startup success.

---

# 4. Startup AI Consultant

After the main analysis, users can continue discussing their startup with a persistent AI consultant.

Example questions:

```text
Should I reduce my pricing?

Which competitor is my biggest threat?

Should I target students or working professionals?

What feature should I remove from my MVP?
```

The consultant uses:

- Startup information
- Founder profile
- Previous agent outputs
- Market research
- Competitor analysis
- Business model
- Financial assumptions
- MVP
- GTM
- RAG knowledge

The consultant is **startup-specific**, rather than a generic chatbot.

---

# 5. Selective Re-Execution

A major feature of IDEON is **dependency-aware selective re-execution**.

When a user changes an assumption, IDEON determines which analysis outputs are affected instead of restarting everything.

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

For example:

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

# 6. Developer Perspective

## Architecture

IDEON is a **Python modular monolith**.

```text
Next.js Frontend
       ↓
     FastAPI
       ↓
    Services
       ↓
   Workflows
       ↓
   LangGraph
       ↓
 Startup State
       ↓
 Specialized Agents
       ↓
 ┌─────┴─────────┐
 ↓               ↓
Gemini       RAG / Research
 ↓               ↓
 └───────┬───────┘
         ↓
 Supabase PostgreSQL
```

The frontend communicates only with the FastAPI backend.

---

# 7. Backend Architecture

### API Layer

Responsible for:

- HTTP endpoints
- Request validation
- Authentication
- API responses
- API versioning

API prefix:

```text
/api/v1/
```

### Service Layer

Coordinates application operations such as:

- Startup management
- Analysis execution
- Chat
- Artifact generation
- Re-execution

### Workflow Layer

Handles high-level workflows:

- Initial analysis
- Selective re-execution
- Chat
- Impact analysis

### Agent Layer

Contains specialized AI agents:

```text
Idea Validator
Market Research
Competitor Analysis
Business Model
Financial
MVP Planner
GTM
Landing Page
Pitch Deck
Verdict
Startup Chat
```

### Graph Layer

LangGraph manages:

- Shared state
- Agent nodes
- Edges
- Routing
- Execution order
- State updates

---

# 8. Agent and Graph Separation

Agents handle AI reasoning.

```text
Context
 ↓
Prompt
 ↓
Gemini
 ↓
Structured Output
```

Graph nodes connect agents to the workflow.

```text
Startup State
 ↓
Graph Node
 ↓
Agent
 ↓
State Update
```

This keeps AI logic separate from workflow orchestration.

---

# 9. RAG System

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

RAG provides relatively stable knowledge, while live web research provides current information.

---

# 10. Web Research

Tavily provides live research.

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

Market Research and Competitor Analysis are the primary research-heavy agents.

---

# 11. Database and Authentication

Supabase provides:

- PostgreSQL
- pgvector
- Authentication
- Storage
- Realtime

Database access:

```text
SQLModel
 ↓
SQLAlchemy
 ↓
Psycopg 3 Async
 ↓
Supabase PostgreSQL
```

Main entities include:

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

Authentication:

```text
User
 ↓
Supabase Auth
 ↓
JWT / Session
 ↓
FastAPI
 ↓
Authentication Dependency
```

The backend enforces ownership of startup data and artifacts.

---

# 12. Realtime Progress

Supabase Realtime is used instead of maintaining a custom FastAPI WebSocket layer.

```text
LangGraph
    ↓
Analysis Progress
    ↓
Supabase PostgreSQL
    ↓
Supabase Realtime
    ↓
Next.js Frontend
```

This keeps realtime infrastructure simpler and avoids maintaining a custom WebSocket manager.

---

# 13. Artifact Generation

IDEON generates:

- PDF startup reports
- PowerPoint pitch decks
- Landing page output

```text
Structured Analysis
 ↓
Artifact Generator
 ↓
Generated File
 ↓
Supabase Storage
 ↓
Artifact Metadata
```

---

# 14. Persistence

LangGraph state is used during workflow execution, while important results are persisted in PostgreSQL.

This supports:

- Analysis history
- Persistent startup context
- Chat
- Artifact references
- Failure recovery
- Selective re-execution
- Versioning

---

# 15. Testing

Testing is kept inside the backend:

```text
backend/
└── tests/
    ├── unit/
    └── integration/
```

Tests will cover:

- Agents
- Graph nodes
- Workflows
- Services
- Financial calculations
- Dependency analysis
- API
- Database
- Authentication
- Workflow execution

LLM tests should validate **structured outputs and behavior**, not exact generated prose.

---

# 16. Architecture Rules

1. The frontend communicates only with FastAPI.
2. LangGraph controls workflow orchestration.
3. Agents perform specialized AI reasoning.
4. Graph nodes connect agents to shared state.
5. Services coordinate application operations.
6. Repositories handle database access.
7. Pydantic schemas define structured contracts.
8. RAG handles stable knowledge retrieval.
9. Tavily handles live research.
10. Python handles deterministic calculations.
11. Supabase provides PostgreSQL, Auth, Storage, and Realtime.
12. Important intermediate results are persisted.
13. Secrets remain server-side.
14. Selective re-execution recomputes only affected outputs.
15. The project remains a modular monolith.

---

# 17. Technology Stack

## Backend

- Python
- FastAPI
- Pydantic
- SQLModel
- SQLAlchemy
- Psycopg 3 Async
- Alembic

## Agentic AI

- LangGraph
- LangChain
- Google Gemini

## Database / Infrastructure

- Supabase PostgreSQL
- pgvector
- Supabase Auth
- Supabase Storage
- Supabase Realtime

## Research

- Tavily

## Artifacts

- ReportLab
- python-pptx

## Frontend

- Next.js
- React
- TypeScript

---

# 18. Final Project Definition

**IDEON is a stateful multi-agent AI platform that transforms startup ideas into structured, research-backed startup plans.**

Its core system combines:

```text
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
PostgreSQL / pgvector
      +
Artifact Generation
      +
Selective Re-execution
```

The primary workflow is:

```text
Startup Idea
    ↓
Multi-Agent Analysis
    ↓
Structured Startup State
    ↓
Research + RAG
    ↓
Startup Plan + Artifacts
    ↓
AI Startup Consultant
    ↓
User Changes Assumption
    ↓
Impact Analysis
    ↓
Selective Re-execution
    ↓
Updated Startup Plan
```

The primary technical goal is to build a **reliable, stateful, modular multi-agent AI system**, rather than simply a collection of LLM prompts.



