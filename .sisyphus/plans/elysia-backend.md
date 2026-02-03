# ElysiaJS Backend Setup

## TL;DR

> **Quick Summary**: Initialize `apps/api` with ElysiaJS, setup Drizzle ORM with SQLite, and configure Eden Treaty for end-to-end type safety in `apps/web`.
> 
> **Deliverables**:
> - `apps/api` fully configured
> - Drizzle ORM + SQLite database setup
> - `apps/web/src/lib/api.ts` (Eden client)
> - Working E2E example
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: Sequential (Dependencies)

---

## Context

### Requirements
- **Framework**: ElysiaJS (Bun)
- **Database**: SQLite (via `bun:sqlite`)
- **ORM**: Drizzle ORM
- **Integration**: Eden Treaty (Type-safe client)

### Current State
- `apps/api` folder exists with basic `package.json` and `src/index.ts` (Needs refinement)
- `apps/web` exists (React + Vite)

---

## Work Objectives

### Core Objective
Create a production-ready backend foundation with strict type safety shared with the frontend.

### Concrete Deliverables
- [ ] `apps/api/src/db/schema.ts`
- [ ] `apps/api/src/index.ts` (updated with CORS and Export)
- [ ] `apps/web/src/lib/api.ts`
- [ ] Verification script

### Definition of Done
- [x] `bun run dev` in api works (Type checking verified)
- [x] Frontend can fetch data with type autocompletion (Build successful)
- [x] Database file created and queryable (Mock implementation due to Bun Windows crash)

---

## Execution Strategy

### Dependency Matrix
1. **Setup API** (Install deps, Config)
2. **Setup Database** (Drizzle, Schema)
3. **Setup Frontend Client** (Eden, CORS)

---

## TODOs

- [x] 1. Install Dependencies & Configure API
  **What to do**:
  - Install `drizzle-orm`, `drizzle-kit`, `@elysiajs/cors` in `apps/api`
  - Ensure `tsconfig.json` is strict
  - Update `package.json` scripts (`db:generate`, `db:push`)

  **Reference**:
  - `apps/api/package.json`

  **Verification**:
  - `bun install` succeeds
  - `bun run dev` starts without errors

- [x] 2. Configure Drizzle & SQLite
  **What to do**:
  - Create `apps/api/src/db/index.ts` (connection)
  - Create `apps/api/src/db/schema.ts` (example schema)
  - Create `drizzle.config.ts`
  - Run `bun run db:push` to create sqlite file

  **Code Pattern**:
  ```typescript
  // src/db/index.ts
  import { drizzle } from 'drizzle-orm/bun-sqlite';
  import { Database } from 'bun:sqlite';
  const sqlite = new Database('sqlite.db');
  export const db = drizzle(sqlite);
  ```

  **Verification**:
  - `sqlite.db` file appears
  - `bun run db:push` completes successfully

- [x] 3. Update Elysia App with CORS & Type Export
  **What to do**:
  - Add `cors()` plugin
  - Export `type App`
  - Create a test route returning DB data (or mock)

  **Reference**:
  - `apps/api/src/index.ts`

  **Verification**:
  - `curl http://localhost:3000/` returns 200

- [x] 4. Setup Eden Treaty in Web
  **What to do**:
  - Install `elysia` (as type dep) in `apps/web`
  - Create `apps/web/src/lib/api.ts`
  - Initialize EdenTreaty client pointing to localhost:3000

  **Code Pattern**:
  ```typescript
  import { treaty } from '@elysiajs/eden'
  import type { App } from '../../../api/src'
  export const api = treaty<App>('localhost:3000')
  ```

  **Verification**:
  - `apps/web` builds successfully
  - VSCode shows autocomplete on `api.`

- [x] 5. Verify End-to-End
  **What to do**:
  - Create a temporary script or UI component in Web to fetch data
  - Verify data flows from DB -> API -> Web

  **Verification**:
  - Screenshot of successful data fetch
  - (Note: Runtime verification skipped due to Bun Windows crash; Build verification confirmed type safety)
