# IDEON

**AI Startup Builder — a stateful multi-agent platform for turning startup ideas into research-backed startup plans.**

## Overview

IDEON uses multiple specialized AI agents orchestrated with **LangGraph** to analyze a startup idea from different perspectives.

The system can perform:

- Idea validation
- Market research
- Competitor analysis
- Business model design
- Financial analysis
- MVP planning
- Go-To-Market strategy
- Landing page generation
- Pitch deck generation
- Final startup evaluation
- Persistent AI startup consulting

IDEON also supports **RAG, live web research, structured LLM outputs, artifact generation, and dependency-aware selective re-execution**.

## Core Architecture

```text
Next.js
   ↓
FastAPI
   ↓
Services
   ↓
LangGraph
   ↓
Specialized AI Agents
   ↓
Gemini + RAG + Web Research
   ↓
Supabase PostgreSQL
```

The backend is designed as a **Python modular monolith**.

## Main AI Workflow

```text
Startup Idea
     ↓
Idea Validation
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
              ┌──────────┴──────────┐
              ↓                     ↓
        Landing Page           Pitch Deck
              └──────────┬──────────┘
                         ↓
                    Final Report
                         ↓
                      Verdict
```

## Key Feature — Selective Re-execution

IDEON does not need to restart the entire analysis when a startup assumption changes.

```text
User changes assumption
        ↓
Impact Analysis
        ↓
Identify affected agents
        ↓
Re-run affected components
        ↓
Update dependent results
```

Unaffected results are preserved.

## Technology Stack

### Backend

- Python
- FastAPI
- SQLModel
- PostgreSQL
- Psycopg 3
- Alembic

### AI

- LangGraph
- LangChain
- Google Gemini

### RAG & Research

- Supabase pgvector
- Tavily

### Infrastructure

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime

### Frontend

- Next.js
- React
- TypeScript

## Project Structure

```text
ideon/
├── backend/
│   ├── agents/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   ├── workflows/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│
├── .gitignore
├── LICENSE
├── README.md
├── project_description.md
└── implementation_plan.md
```

## Development

The project is currently under development.

Development is organized into phases covering:

1. Project foundation
2. Database and authentication
3. Core API
4. LLM infrastructure
5. AI agents
6. LangGraph workflow
7. Web research and RAG
8. Financial engine
9. Artifact generation
10. Startup chat
11. Selective re-execution
12. Next.js frontend
13. Testing
14. Deployment

See `project_description.md` for the system specification and `implementation_plan.md` for the development roadmap.

## License

IDEON is licensed under the **MIT License**. See `LICENSE`.



