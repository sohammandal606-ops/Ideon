# IDEON frontend

The frontend setup, environment variables, API overview, and local development
instructions are documented in the [project README](../README.md).

From this directory, install dependencies and start the development server:

```powershell
npm ci
npm run dev
```

The web app runs at `http://localhost:3000`. Configure `NEXT_PUBLIC_API_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in a local
`.env.local` file before running it.
