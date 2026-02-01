# AGENTS.md

Agentic coding guide for the Ocean1 monorepo.

## Project Overview

**Monorepo**: Bun workspaces with `apps/*` and `packages/*`  
**Primary App**: React + TypeScript + Vite web app in `apps/web`  
**UI System**: shadcn/ui (New York style) + Tailwind CSS + Radix UI  
**Routing**: TanStack Router (file-based routing)

---

## Build Commands

```bash
# Root level (uses Bun)
bun install          # Install dependencies
bun run --filter web dev      # Run dev server
bun run --filter web build    # Production build
bun run --filter web lint     # Run ESLint
bun run --filter web preview  # Preview production build

# Inside apps/web/
cd apps/web
bun dev              # Start dev server (Vite)
bun build            # Type-check + build
bun lint             # ESLint check
bun preview          # Preview production build
```

### Note on Testing
No test framework is configured yet. To add tests, consider:
- `vitest` (works well with Vite)
- `@testing-library/react` for component tests

---

## Code Style Guidelines

### TypeScript
- **Target**: ES2022, strict mode enabled
- **Module**: ESNext with bundler resolution
- **JSX**: `react-jsx` transform
- Always use explicit return types for exported functions
- No `any` types - use `unknown` if type is uncertain
- Enable `noUnusedLocals` and `noUnusedParameters`

### Imports
```typescript
// 1. React imports
import * as React from "react"
import { useState, useEffect } from 'react'

// 2. External libraries
import { createFileRoute } from '@tanstack/react-router'
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

// 3. Internal aliases (use @/*)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

### Naming Conventions
- **Components**: PascalCase (e.g., `Button.tsx`, `PrimarySidebar.tsx`)
- **Files**: kebab-case (e.g., `mock-data.ts`, `use-toast.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useToast`)
- **Types/Interfaces**: PascalCase with descriptive names
- **CSS Classes**: Tailwind utilities (no custom CSS files)

### Component Patterns

#### UI Components (shadcn style)
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "base-classes",
  {
    variants: { variant: { default: "..." } },
    defaultVariants: { variant: "default" }
  }
)

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button className={cn(buttonVariants(...), className)} ref={ref} {...props} />
  }
)
Button.displayName = "Button"
```

#### Route Components (TanStack Router)
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  // Component logic
}
```

### Styling
- Use Tailwind CSS exclusively
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Theme uses CSS variables (defined in `index.css`)
- Colors: `primary`, `secondary`, `muted`, `accent`, `destructive`, etc.
- Dark mode: `dark` class on root element

### Error Handling
- Use TypeScript strict mode - catch errors at compile time
- No empty catch blocks
- For async errors, use try/catch with proper error messages

### File Structure
```
apps/web/src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Layout components
│   └── *.tsx         # Other components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, helpers, types
├── routes/           # TanStack Router route files
├── main.tsx          # App entry point
└── index.css         # Tailwind + CSS variables
```

---

## Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:
- `@/*` → `./src/*`

Examples:
- `@/components/ui/button`
- `@/lib/utils`
- `@/hooks/use-toast`

---

## ESLint Configuration

Uses `typescript-eslint` with:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `react-hooks` plugin
- `react-refresh` plugin

Config location: `apps/web/eslint.config.js`

---

## Dependencies

### Core
- React 19, React DOM 19
- TypeScript 5.9
- Vite 7

### UI
- Tailwind CSS 3.4
- shadcn/ui components (New York style)
- Radix UI primitives
- class-variance-authority (CVA)
- clsx + tailwind-merge (via `cn()`)
- lucide-react (icons)

### Routing
- @tanstack/react-router
- @tanstack/router-plugin (Vite plugin)

---

## Common Tasks

### Add a shadcn component
```bash
npx shadcn add <component-name>
# or
bunx shadcn add <component-name>
```

### Create a new route
1. Create file in `apps/web/src/routes/` (e.g., `about.tsx`)
2. Use `createFileRoute` from `@tanstack/react-router`
3. File path becomes the route path (e.g., `routes/about.tsx` → `/about`)

### Add a new UI component
1. Create in `apps/web/src/components/ui/`
2. Follow existing component patterns (CVA, forwardRef, cn utility)
3. Export from barrel file if needed

---

## Development Workflow

### Commit Message Format (Conventional Commits)

All commits must follow the Conventional Commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

**Examples:**
```bash
feat: add dark mode toggle component
fix(auth): resolve login redirect loop
docs: update API endpoint documentation
refactor(ui): simplify button component props
```

### Development Log (Devlog)

After completing each feature, document it in `/docs/devlog/` with the following format:

**File naming:** `YYYY-MM-DD_v{version}.md`  
**Example:** `2026-02-01_v1.md`

**Template:**
```markdown
# YYYY-MM-DD (v{version}): {Brief Title}

## Summary
- {What was implemented}
- {Key changes}

## Files Changed
- `path/to/file.tsx` - {description}
- `path/to/file.ts` - {description}

## Screenshots
{Insert screenshots in `/docs/screenshots/`}

## Notes
- {Any important notes or future considerations}
```

**Steps:**
1. Run the application (`bun dev`)
2. Navigate to the feature and take screenshots
3. Save screenshots to `/docs/screenshots/`
4. Create devlog file in `/docs/devlog/`
5. Update `/docs/README.md` with the new entry

---

## Important Notes

- **No Prettier configured** - rely on ESLint for formatting
- **No test framework** - add one if needed
- **Bun lockfile**: `bun.lock` (do not use npm/yarn)
- **Build output**: `apps/web/dist/`
- **Type generation**: TanStack Router auto-generates `routeTree.gen.ts`
- **Strict mode**: Enabled in React (see `main.tsx`)
