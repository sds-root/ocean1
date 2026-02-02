# Issues
- None yet.

## Drizzle Kit / Bun 1.3.8 Compatibility (Windows)
- `drizzle-kit` commands (push, generate) crash with `panic(main thread): invalid enum value` when run with `bun` on Windows.
- `drizzle-kit` check for `drizzle-orm` often fails in Bun workspaces because it doesn't correctly follow symlinks in `node_modules`.
- Root `node_modules/.bin` was missing in this environment, making it difficult to run global binaries directly through `bun run`.
- Bun on Windows (v1.3.8) currently panics with `invalid enum value` when running Drizzle with either `bun:sqlite` or `better-sqlite3`. This appears to be a runtime bug on Windows.
## 2026-02-02: LibSQL on Bun Windows
- Switching to @libsql/client did not resolve the Bun crash on Windows.
- Both @libsql/client and better-sqlite3 cause Bun to panic with 'invalid enum value' on Windows.
- bun:sqlite remains the only stable SQLite option in this environment.
- Verified that `bun:sqlite` works correctly by running a native check script.

## 2026-02-02: Persistent Drizzle/Bun Crash
- **Bun Crash on Windows**: `bun:sqlite`, `better-sqlite3`, and `@libsql/client` all cause Bun to panic ("invalid enum value") when used with Drizzle ORM on Windows.
  - **Workaround**: Native `bun:sqlite` works fine (verified by `check-native.ts`). The issue is likely within Drizzle's interaction or specific Windows ABI issues in Bun 1.1.x.
  - **Decision**: Proceeding with standard `bun:sqlite` configuration. If it fails in production/Linux, we will revisit. For now, we assume it's a local Windows dev artifact.
  - **UPDATE**: Imports of `drizzle-orm/bun-sqlite` cause immediate crash. We are switching to a **MOCK DB** implementation to unblock Frontend/Eden work.

## 2026-02-02: Elysia Runtime Crash
- Even with Mock DB, `bun run apps/api/src/index.ts` crashes or fails to bind port on this Windows environment.
- **Impact**: Cannot verify runtime behavior of Backend.
- **Mitigation**: Relying on Type Checks (`bun tsc`). Eden Treaty relies on static types, so we can still implement the frontend client.

## 2026-02-02: Web Build Failure (TSC)
- `bun run --filter web build` failed because it couldn't find `tsc` in `apps/web/node_modules/typescript/bin/tsc`.
- **Cause**: TypeScript might be hoisted to root or not installed in `apps/web`.
- **Fix**: Run `bun install` again to ensure workspace links are correct, or use `bunx tsc`.
- **Resolution**: Fixed by running `bun install` in root and ensuring `apps/api/src/db/index.ts` mock implementation matched the expected Drizzle signature (accepting arguments). Build now passes.
## 2026-02-03: TanStack Router Synchronization
- `tsc -b` runs before `vite build` in the web build script. If a new route is added, `tsc` will fail because the route tree hasn't been generated yet.
- **Fix**: Run `vite build` (or `vite`) to generate the route tree before running full type checks if `tsc` fails on route types.
