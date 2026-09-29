# IDEON

IDEON is an AI startup builder that helps founders evaluate and refine startup
ideas. It combines a Next.js web application with a FastAPI backend, Supabase
authentication and PostgreSQL, and a LangGraph-based analysis workflow.

The backend represents each startup and its analysis runs as structured data.
Its workflow contains specialist agents for idea validation, market research,
competitor analysis, business modeling, financial analysis, MVP planning,
go-to-market strategy, and a final verdict.

## Current application

- A public landing page, signup and login screens, and a startup dashboard.
- Startup project creation and management.
- Authenticated API endpoints for users, startups, and startup analysis.
- Background execution of startup analysis and endpoints to retrieve analysis
  runs.
- Database models, repositories, and Alembic migrations for persistent data.
- Backend tests for API routes and the analysis workflow.

## Technology

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS.
- **Backend:** Python 3.12+, FastAPI, SQLModel, and Uvicorn.
- **AI workflow:** LangGraph and LangChain integrations.
- **Data and authentication:** Supabase Auth, Supabase PostgreSQL, and pgvector.
- **Python tooling:** `uv`, Alembic, pytest, and Ruff.

## Project layout

```text
Ideon/
├── backend/
│   ├── api/v1/routes/       # Auth, user, startup, and analysis API endpoints
│   ├── core/                # Application settings and Supabase client
│   ├── db/                  # Database connection, models, repositories, migrations
│   ├── schemas/             # Request and response schemas
│   ├── services/            # Application and analysis services
│   ├── workflows/           # LangGraph state, agents, and workflow
│   ├── tests/               # Backend tests
│   ├── main.py              # FastAPI application
│   └── pyproject.toml       # Python dependencies and tool configuration
├── frontend/
│   ├── src/app/             # Landing, auth, dashboard, and project pages
│   ├── src/components/      # UI, landing, dashboard, and layout components
│   ├── src/context/         # Authentication and UI state providers
│   ├── src/lib/             # API, Supabase, and shared helpers
│   └── package.json         # Frontend scripts and dependencies
├── implementation_plan.md   # Development plan
└── project_description.md   # Product and workflow description
```

## Prerequisites

- Python 3.12 or newer.
- [`uv`](https://docs.astral.sh/uv/).
- Node.js and npm.
- A Supabase project with PostgreSQL available. The database must have the
  `vector` extension enabled for the database health check.
- Provider API credentials for any AI or research integrations you use.

## Configuration

### Backend

From `backend/`, copy `.env.example` to `.env` and replace the placeholders:

```powershell
Copy-Item .env.example .env
```

The backend requires these server-side settings:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection URL using the `postgresql+asyncpg` driver |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Server-only Supabase key; never put this in frontend configuration |

The example file also includes `GROQ_API_KEY`, `GROQ_MODEL`, and
`GROQ_TEMPERATURE`. The backend supports optional per-agent Mistral settings;
see `backend/core/config.py` for the names and defaults. Keep real credentials
out of source control.

### Frontend

Create `frontend/.env.local` with the public frontend settings:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

`NEXT_PUBLIC_API_URL` is the API origin. The frontend client appends `/api/v1`
when making API requests. Only use a Supabase anon/publishable key in the
frontend; the backend secret key must remain server-side.

## Run locally

Open separate terminals from the project root.

### 1. Install backend dependencies and apply migrations

```powershell
Set-Location backend
uv sync
uv run alembic upgrade head
```

The backend `.env` file must be configured before starting the application or
running migrations.

### 2. Start the backend

In the backend terminal:

```powershell
uv run uvicorn main:app --reload
```

The API is available at `http://localhost:8000`. Interactive API documentation
is at `http://localhost:8000/docs`.

### 3. Install frontend dependencies and start the web app

In another terminal:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Open `http://localhost:3000`.

## API overview

All application routes use the `/api/v1` prefix.

| Area | Routes |
| --- | --- |
| Health | `GET /api/v1/health`, `GET /api/v1/db-health` |
| Authentication | `POST /api/v1/auth/signup`, `POST /api/v1/auth/login` |
| Current user | `GET /api/v1/users/me`, `PATCH /api/v1/users/me`, `GET /api/v1/users/me/stats` |
| Startups | `GET` and `POST /api/v1/startups`; `GET`, `PATCH`, and `DELETE /api/v1/startups/{startup_id}` |
| Analysis | `POST` and `GET /api/v1/startups/{startup_id}/analysis`; `GET /api/v1/startups/{startup_id}/analysis/{run_id}` |

Analysis is queued as a FastAPI background task. Refer to the interactive API
documentation for request and response schemas.

## Checks

Run backend tests from `backend/`:

```powershell
uv run pytest
```

Run backend lint checks:

```powershell
uv run ruff check .
```

Run frontend lint and production build from `frontend/`:

```powershell
npm run lint
npm run build
```

## Further documentation

- [Project description](./project_description.md) — product concept and user
  workflow.
- [Implementation plan](./implementation_plan.md) — development strategy and
  planned work.
