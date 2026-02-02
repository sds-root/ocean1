# Learnings
- Monorepo uses Bun workspaces.
- `apps/web` is the frontend.
- `apps/api` will be the backend.
- `web` package is named `web` (not scoped).

## Drizzle & Bun SQLite Setup
- Configured Drizzle ORM in `apps/api` using `bun:sqlite` adapter.
- `src/db/index.ts` exports the `db` instance.
- `src/db/schema.ts` defines a `todos` table.
- Encountered issues with `drizzle-kit push` crashing on Bun 1.3.8 (Windows) and failing to find `drizzle-orm` due to symlinks.
- Manually generated `sqlite.db` using a temporary Bun script when `db:push` failed.
- Drizzle config set to `sqlite` dialect with `drizzle.config.ts`.
- Switched Drizzle driver in `apps/api` from `bun-sqlite` to `better-sqlite3`.
- On Windows, `better-sqlite3` installation via Bun may require `prebuild-install` to be installed explicitly if it's not found by the installer script.
## 2026-02-02: SQLite Drivers on Bun Windows
- Use bun:sqlite for stable local SQLite on Windows.
- Avoid native bindings like better-sqlite3 and @libsql/client for local files as they trigger Bun panics.
- Reverted to `bun:sqlite` (via `drizzle-orm/bun-sqlite`) after `check-native.ts` confirmed its reliability in this environment.
- Updated apps/api/src/index.ts to include CORS and database connection.
- Added /api/todos route to fetch todos from SQLite database using Drizzle.
- Exported App type for frontend type safety.
## 2026-02-03: Web Build Fixed
- Fixed argument mismatch in mock DB `from()` method in `apps/api/src/db/index.ts`.
- Triggered TanStack Router route tree generation by running `vite build` directly in `apps/web`.
- Verified that `bun run --filter web build` now completes successfully, ensuring type safety between Backend (Elysia) and Frontend (Eden Treaty).
