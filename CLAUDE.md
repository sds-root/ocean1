# CLAUDE.md - Ocean1

## Project Overview

Ocean1 is a DevOps automation platform with LLM-based infrastructure management. Monorepo using Bun workspaces.

## Architecture

```
ocean1/
├── apps/
│   ├── api/        # ElysiaJS backend (Bun runtime, port 3000)
│   └── web/        # React 19 frontend (Vite, TanStack Router)
├── packages/       # Shared libraries (reserved)
└── docs/           # Devlogs and screenshots
```

## Tech Stack

**Backend:** Bun, ElysiaJS, Drizzle ORM, SQLite (currently mocked on Windows), Zod
**Frontend:** React 19, Vite 7, TanStack Router (file-based), shadcn/ui, Tailwind CSS 3, Radix UI
**AI/LLM:** Vercel AI SDK, @ai-sdk/google (Gemini), @ai-sdk/openai (Ollama)
**API Client:** Eden Treaty (type-safe, auto-generated from ElysiaJS)

## Commands

```bash
# Development (from root)
bun run dev              # Run API + web concurrently
bun run --filter web dev
bun run --filter api dev

# Build
bun run --filter web build   # tsc -b && vite build

# Lint
bun run --filter web lint

# Database
bun run --filter api db:generate   # Generate Drizzle migrations
bun run --filter api db:push       # Push schema to SQLite

# Add UI components
bunx shadcn add <component>
```

## Code Conventions

- **TypeScript strict mode** everywhere — no `any`, use `unknown` if needed
- **Path alias:** `@/*` → `./src/*` (frontend)
- **Styling:** Tailwind CSS only, use `cn()` from `@/lib/utils` for conditional classes
- **Components:** shadcn/ui patterns with `cva()`, `React.forwardRef`, `displayName`
- **Routing:** File-based via TanStack Router in `apps/web/src/routes/`
- **Dark mode:** Class-based, default dark, storage key `ocean1-ui-theme`
- **Commits:** Conventional Commits (`feat`, `fix`, `docs`, `chore`, etc.)
- **No Prettier** — ESLint only

### Naming

| Type          | Convention  | Example                  |
|---------------|-------------|--------------------------|
| Components    | PascalCase  | `ChatPage.tsx`           |
| Files         | kebab-case  | `mock-data.ts`           |
| Hooks         | `use` prefix | `use-mention.ts`        |
| Types         | PascalCase  | `ResourceNode`           |

### Import Order

1. React imports
2. External libraries
3. Internal (`@/*`) imports

## Key Files

- `apps/api/src/index.ts` — API entry point, routes
- `apps/api/src/db/schema.ts` — Drizzle schema definitions
- `apps/api/drizzle.config.ts` — Drizzle ORM config (SQLite)
- `apps/web/src/routes/` — All page routes (auto-generates `routeTree.gen.ts`)
- `apps/web/src/components/ui/` — shadcn/ui components
- `apps/web/src/lib/api.ts` — Eden Treaty client
- `apps/web/src/lib/mock-data.ts` — Types and mock data
- `apps/web/src/index.css` — Tailwind + CSS variable theme definitions

## API Endpoints

| Method | Route         | Purpose                        |
|--------|---------------|--------------------------------|
| GET    | `/`           | Health check                   |
| GET    | `/api/todos`  | Fetch todos                    |
| POST   | `/api/chat`   | LLM chat (streaming response)  |

## Environment Variables (apps/api/.env)

```
LLM_PROVIDER=ollama|gemini
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=gemma3:4b
GOOGLE_GENERATIVE_AI_API_KEY=<key>
```

## Known Issues

- SQLite crashes on Bun Windows runtime — database is mocked in `apps/api/src/db/index.ts`
- No test framework configured yet (Playwright installed for e2e)
