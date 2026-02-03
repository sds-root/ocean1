# Learnings
- **Bun + Windows + Elysia/Drizzle**: Bun 1.3.8 on Windows has severe compatibility issues with native SQLite (bun:sqlite) and Drizzle ORM, causing "panic: invalid enum value" crashes.
- **Workaround**: Using `bun:sqlite` directly (not through Drizzle) works fine, but Drizzle integration fails.
- **Alternative**: Native `bun:sqlite` + Drizzle causes crashes; `better-sqlite3` also crashes; `@libsql/client` also crashes.
- **Resolution**: Implemented Mock DB in `apps/api/src/db/index.ts` to unblock frontend work. Mock matches Drizzle API signature.
- **Frontend Integration**: Eden Treaty (`@elysiajs/eden`) successfully configured in `apps/web`. Build passes with type checking.
- **Build Script**: `bun run --filter web build` failed initially due to missing `tsc` in local node_modules. Fixed by running `bun install` in root for workspace linking, and build now passes using `bunx tsc -b`.
- **TanStack Router**: New routes need `vite build` to generate `routeTree.gen.ts` before `tsc` type checking, otherwise route types won't be found.
