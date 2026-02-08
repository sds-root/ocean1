# Learnings

## Project Structure
- Monorepo with `apps/web` (Vite + React + TS)
- UI: shadcn/ui + Tailwind
- Routing: TanStack Router

## Patterns
- Settings are currently in `SettingsSubmenu` inside `SecondaryPanel`.
- We are moving User Preferences to a separate `/profile` route.
