# AI DevOps Automation Tool - Monorepo Setup & UI Prototype

## TL;DR

> **Build a modern AI-powered DevOps automation tool UI with monorepo architecture.**
>
> **Deliverables**:
> - Monorepo structure with bun workspaces
> - Landing page (Hero, Features, CTA)
> - Login page with MFA UI
> - AI Chat interface (Claude Code style)
>
> **Estimated Effort**: Medium (2-3 days)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Monorepo setup → Page layouts → Chat interface

---

## Context

### Original Request
AI 운영 자동화 도구 프로젝트 시작. Claude Code처럼 프롬프트를 통해 인프라를 관리할 수 있는 도구. Monorepo로 API와 Web 분리, UI 프로토타입부터 시작.

### Interview Summary
**Key Decisions**:
- Package Manager: **bun** (fast, built-in workspace)
- Monorepo: **bun workspaces** (no Turborepo needed)
- Routing: **TanStack Router** (type-safe, modern)
- MFA: **SMS/Email OTP**
- AI Scope: **Full-stack DevOps** (servers, DB, CI/CD, monitoring)
- Design: **Vercel/Linear style** (modern, gradient animations)
- Theme: **Dark mode default** + light mode toggle
- Testing: **Add later** (focus on implementation first)
- shadcn/ui: **Rich set** (14 components)

### Metis Review
**Identified Gaps** (addressed):
- Component selection: Rich set chosen (button, card, input, dialog, dropdown-menu, avatar, badge, tooltip, tabs, accordion, toast, select, textarea, separator)
- Scope lockdown: UI prototype only, no backend integration
- Guardrails: Avoid over-abstraction, follow shadcn/ui patterns

---

## Work Objectives

### Core Objective
Create a functional UI prototype for an AI DevOps automation tool with 3 pages: Landing, Login (MFA), and AI Chat interface.

### Concrete Deliverables
- `apps/web/` - React app with TanStack Router
- `packages/ui/` - Shared shadcn/ui components
- 3 complete page UIs with mock data
- Dark/light theme toggle
- Responsive design

### Definition of Done
- [ ] All 3 pages render correctly in browser
- [ ] Navigation works between pages
- [ ] Theme toggle switches dark/light mode
- [ ] Responsive on desktop, tablet, mobile
- [ ] shadcn/ui components render properly

### Must Have
- Bun workspaces monorepo structure
- Vite + React + TypeScript setup
- TailwindCSS with dark mode
- TanStack Router integration
- 14 shadcn/ui components installed
- Landing page with Hero, Features, CTA
- Login page with email/password + MFA OTP UI
- AI Chat page with sidebar + chat interface

### Must NOT Have (Guardrails)
- ❌ Backend API integration (mock data only)
- ❌ Actual authentication logic
- ❌ Real AI integration
- ❌ Database connections
- ❌ Premature component abstraction
- ❌ Over-engineered state management

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: NO (add later)
- **QA approach**: Manual verification via browser

### Automated Verification (Agent-Executable)

Each TODO includes executable verification procedures:

**Frontend/UI Verification** (using playwright skill):
```
Agent navigates to each route, verifies:
1. Page renders without errors
2. Key elements visible (via DOM selectors)
3. Theme toggle works (class changes)
4. Responsive layout (viewport changes)
5. Screenshots saved to .sisyphus/evidence/
```

**Build Verification** (using Bash):
```bash
# Agent runs:
bun run build
# Assert: Exit code 0
# Assert: dist/ folder created with files
```

**Dev Server Verification** (using interactive_bash):
```bash
# Agent runs dev server:
bun run dev
# Wait for: "Vite server started"
# Verify: http://localhost:5173 accessible
```

### Evidence Requirements
- Screenshot files in `.sisyphus/evidence/` for each page
- Build output logs
- Dev server startup confirmation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Monorepo Setup) - Start Immediately:
├── Task 1: Create bun workspaces structure
├── Task 2: Setup apps/web with Vite+React
└── Task 3: Configure TailwindCSS + shadcn/ui

Wave 2 (Core Infrastructure) - After Wave 1:
├── Task 4: Setup TanStack Router
├── Task 5: Install shadcn/ui components
└── Task 6: Create theme system (dark/light)

Wave 3 (Page Implementation) - After Wave 2:
├── Task 7: Build Landing page
├── Task 8: Build Login page with MFA
└── Task 9: Build AI Chat page

Wave 4 (Integration) - After Wave 3:
├── Task 10: Connect routing between pages
├── Task 11: Responsive design pass
└── Task 12: Final verification

Critical Path: 1 → 2 → 3 → 4 → 5 → 6 → 7,8,9 → 10 → 12
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3 | None |
| 2 | 1 | 4 | 3 |
| 3 | 1 | 4, 5 | 2 |
| 4 | 2, 3 | 6, 7, 8, 9 | 5 |
| 5 | 2, 3 | 7, 8, 9 | 4 |
| 6 | 4 | 7, 8, 9 | None |
| 7 | 4, 5, 6 | 10 | 8, 9 |
| 8 | 4, 5, 6 | 10 | 7, 9 |
| 9 | 4, 5, 6 | 10 | 7, 8 |
| 10 | 7, 8, 9 | 12 | 11 |
| 11 | 7, 8, 9 | 12 | 10 |
| 12 | 10, 11 | None | None |

---

## TODOs

### Wave 1: Monorepo Setup

- [x] **1. Create bun workspaces monorepo structure**

  **What to do**:
  - Create root `package.json` with workspace configuration
  - Create `apps/` and `packages/` directories
  - Setup workspace paths: `apps/*`, `packages/*`
  
  **Must NOT do**:
  - Don't add unnecessary root dependencies
  - Don't create backend app yet (web only)
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Simple file/directory creation task
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (must complete first)
  - **Blocks**: Task 2, Task 3
  
  **Acceptance Criteria**:
  - [ ] Root `package.json` exists with `"workspaces": ["apps/*", "packages/*"]`
  - [ ] `apps/` directory created
  - [ ] `packages/` directory created
  - [ ] `bun install` runs without errors

  **Commit**: NO (group with Wave 1)

- [x] **2. Setup apps/web with Vite + React + TypeScript**

  **What to do**:
  - Create `apps/web/` directory
  - Initialize Vite React TypeScript project
  - Configure basic project structure
  
  **Must NOT do**:
  - Don't use Create React App (deprecated)
  - Don't add unnecessary boilerplate
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3)
  - **Blocked By**: Task 1
  
  **Acceptance Criteria**:
  - [ ] `apps/web/package.json` created
  - [ ] `vite.config.ts` with React plugin
  - [ ] `tsconfig.json` configured
  - [ ] `index.html` entry point
  - [ ] `src/main.tsx` with React root
  - [ ] `bun run dev` starts dev server
  
  **Verification**:
  ```bash
  cd apps/web && bun run dev
  # Wait for server start
  curl -s http://localhost:5173 | head -20
  # Assert: Returns HTML with React mount point
  ```
  
  **Commit**: NO (group with Wave 1)

- [x] **3. Configure TailwindCSS + shadcn/ui base**

  **What to do**:
  - Install TailwindCSS dependencies
  - Create tailwind.config.js with dark mode support
  - Setup shadcn/ui initialization files
  - Configure CSS variables for theming
  
  **Must NOT do**:
  - Don't install components yet (Wave 2)
  - Don't add custom plugins yet
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Blocked By**: Task 1
  
  **Acceptance Criteria**:
  - [ ] `tailwind.config.js` created with darkMode: 'class'
  - [ ] `postcss.config.js` configured
  - [ ] `src/index.css` with Tailwind directives
  - [ ] shadcn/ui config file created
  - [ ] CSS variables for colors defined
  
  **Verification**:
  ```bash
  cd apps/web && bun run build
  # Assert: Build succeeds, CSS processed
  ```
  
  **Commit**: YES
  - Message: `chore: setup monorepo with bun workspaces, vite, tailwind`
  - Files: All Wave 1 files

### Wave 2: Core Infrastructure

- [x] **4. Setup TanStack Router**

  **What to do**:
  - Install @tanstack/react-router
  - Create router configuration
  - Setup route tree
  - Create root route layout
  
  **Must NOT do**:
  - Don't mix with React Router (choose one)
  - Don't lazy load yet (add later if needed)
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 5)
  - **Blocked By**: Task 2, Task 3
  - **Blocks**: Task 6, 7, 8, 9
  
  **Acceptance Criteria**:
  - [ ] TanStack Router installed
  - [ ] Router configuration created
  - [ ] Root layout route defined
  - [ ] Basic navigation works
  
  **Verification**:
  ```bash
  cd apps/web && bun run dev
  # Navigate to localhost:5173
  # Check browser console - no router errors
  ```
  
  **Commit**: NO (group with Wave 2)

- [x] **5. Install shadcn/ui components**

  **What to do**:
  - Initialize shadcn/ui in apps/web
  - Install rich component set (14 components):
    - button, card, input, dialog, dropdown-menu, avatar, badge, tooltip, tabs, accordion, toast, select, textarea, separator
  - Configure component aliases
  
  **Must NOT do**:
  - Don't install unused components
  - Don't customize component internals yet
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4)
  - **Blocked By**: Task 2, Task 3
  - **Blocks**: Task 7, 8, 9
  
  **Acceptance Criteria**:
  - [ ] `components.json` configured
  - [ ] All 14 components installed in `src/components/ui/`
  - [ ] Component imports work without errors
  
  **Verification**:
  ```bash
  cd apps/web
  bun run build
  # Assert: No module resolution errors
  ```
  
  **Commit**: NO (group with Wave 2)

- [ ] **6. Create theme system (dark/light toggle)**

  **What to do**:
  - Create theme context/provider
  - Implement dark mode toggle logic
  - Add theme toggle UI component
  - Persist theme preference to localStorage
  
  **Must NOT do**:
  - Don't use complex CSS-in-JS (Tailwind class strategy)
  - Don't hardcode theme values
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on 4)
  - **Blocked By**: Task 4
  - **Blocks**: Task 7, 8, 9
  
  **Acceptance Criteria**:
  - [ ] Theme provider context created
  - [ ] Dark mode class toggles on html element
  - [ ] Toggle button component works
  - [ ] Preference persists after refresh
  - [ ] Default is dark mode
  
  **Verification** (Playwright):
  ```
  1. Navigate to app
  2. Click theme toggle button
  3. Assert: html class changes from 'dark' to 'light'
  4. Refresh page
  5. Assert: Theme persists
  ```
  
  **Commit**: YES
  - Message: `feat: setup tanstack router, shadcn components, theme system`
  - Files: All Wave 2 files

### Wave 3: Page Implementation

- [ ] **7. Build Landing page**

  **What to do**:
  - Create `/` route
  - Hero section with gradient background (Vercel style)
  - Features grid (4-6 cards)
  - How It Works section
  - CTA buttons (Get Started, View Demo)
  - Footer
  
  **Must NOT do**:
  - Don't add heavy animations (keep simple)
  - Don't hardcode all content (prepare for CMS later)
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: ["frontend-ui-ux"]
    - frontend-ui-ux: Modern UI design implementation
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 8, 9)
  - **Blocked By**: Task 4, 5, 6
  - **Blocks**: Task 10
  
  **Acceptance Criteria**:
  - [ ] Route `/` renders landing page
  - [ ] Hero section with title, subtitle, CTA
  - [ ] Features grid with icons
  - [ ] Dark mode styling applied
  - [ ] Responsive layout works
  
  **Verification** (Playwright):
  ```
  1. Navigate to /
  2. Screenshot: hero section visible
  3. Scroll to features
  4. Screenshot: features visible
  5. Click "Get Started" → navigates to /login
  ```
  
  **Commit**: NO (group with Wave 3)

- [ ] **8. Build Login page with MFA**

  **What to do**:
  - Create `/login` route
  - Email/password form with validation UI
  - MFA OTP step (6-digit input)
  - Remember me checkbox
  - Forgot password link
  - Form state management (mock submission)
  
  **Must NOT do**:
  - Don't implement real auth logic
  - Don't connect to real backend
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: ["frontend-ui-ux"]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 7, 9)
  - **Blocked By**: Task 4, 5, 6
  - **Blocks**: Task 10
  
  **Acceptance Criteria**:
  - [ ] Route `/login` renders login page
  - [ ] Email/password form UI complete
  - [ ] MFA step UI (6-digit inputs)
  - [ ] Form validation UI (error states)
  - [ ] Dark mode styling
  - [ ] "Login" button navigates to /chat
  
  **Verification** (Playwright):
  ```
  1. Navigate to /login
  2. Fill email: test@example.com
  3. Fill password: (any)
  4. Click "Continue"
  5. Assert: MFA step appears
  6. Fill OTP: 123456
  7. Click "Verify"
  8. Assert: Navigates to /chat
  ```
  
  **Commit**: NO (group with Wave 3)

- [ ] **9. Build AI Chat page**

  **What to do**:
  - Create `/chat` route
  - Sidebar with conversation history
  - Chat message area (scrollable)
  - Message input with send button
  - Mock AI responses
  - Claude Code style UI
  
  **Must NOT do**:
  - Don't implement real AI connection
  - Don't add complex state persistence yet
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: ["frontend-ui-ux"]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 7, 8)
  - **Blocked By**: Task 4, 5, 6
  - **Blocks**: Task 10
  
  **Acceptance Criteria**:
  - [ ] Route `/chat` renders chat page
  - [ ] Sidebar visible with history items
  - [ ] Chat input at bottom
  - [ ] Message bubbles (user right, AI left)
  - [ ] Mock AI response displays
  - [ ] Scrollable message area
  - [ ] Dark mode styling
  
  **Verification** (Playwright):
  ```
  1. Navigate to /chat
  2. Screenshot: chat interface visible
  3. Type in input: "List my servers"
  4. Click send
  5. Assert: User message appears in chat
  6. Assert: Mock AI response appears
  7. Assert: Auto-scroll to bottom
  ```
  
  **Commit**: YES
  - Message: `feat: implement landing, login, chat pages`
  - Files: All Wave 3 files

### Wave 4: Integration & Polish

- [ ] **10. Connect routing between pages**

  **What to do**:
  - Ensure all routes work
  - Add navigation links
  - Handle 404s
  - Add route guards (UI only, no auth logic)
  
  **Must NOT do**:
  - Don't implement real auth guards
  - Don't add loading states yet
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 11)
  - **Blocked By**: Task 7, 8, 9
  - **Blocks**: Task 12
  
  **Acceptance Criteria**:
  - [ ] All routes accessible: /, /login, /chat
  - [ ] Navigation links work
  - [ ] Browser back/forward works
  
  **Verification**:
  ```bash
  # Test all routes
curl -s http://localhost:5173/ | grep -o "<title>.*</title>"
curl -s http://localhost:5173/login | grep -o "<title>.*</title>"
curl -s http://localhost:5173/chat | grep -o "<title>.*</title>"
  ```
  
  **Commit**: NO (group with Wave 4)

- [ ] **11. Responsive design pass**

  **What to do**:
  - Mobile: Sidebar becomes drawer
  - Tablet: Adjusted spacing
  - Desktop: Full layout
  - Test all breakpoints
  
  **Must NOT do**:
  - Don't over-optimize for mobile (desktop first)
  - Don't add complex responsive logic
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: ["frontend-ui-ux"]
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with 10)
  - **Blocked By**: Task 7, 8, 9
  - **Blocks**: Task 12
  
  **Acceptance Criteria**:
  - [ ] Mobile layout works (sidebar hidden/drawer)
  - [ ] Tablet layout works
  - [ ] Desktop layout works
  - [ ] No horizontal scrollbars
  
  **Verification** (Playwright):
  ```
  Test at 375px, 768px, 1024px, 1440px viewports
  Screenshot each page at each size
  ```
  
  **Commit**: NO (group with Wave 4)

- [ ] **12. Final verification**

  **What to do**:
  - Run full build
  - Verify all components render
  - Check console for errors
  - Screenshot all pages
  - Document any known issues
  
  **Must NOT do**:
  - Don't fix every minor visual issue
  - Don't add features not in scope
  
  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
  
  **Parallelization**:
  - **Can Run In Parallel**: NO (final task)
  - **Blocked By**: Task 10, 11
  
  **Acceptance Criteria**:
  - [ ] `bun run build` succeeds
  - [ ] No console errors on any page
  - [ ] All screenshots captured
  - [ ] Evidence saved to `.sisyphus/evidence/`
  
  **Verification**:
  ```bash
  cd apps/web
  bun run build
  # Assert: Exit code 0
  
  bun run dev &
  # Test all pages manually
  # Capture screenshots
  ```
  
  **Commit**: YES
  - Message: `feat: complete ui prototype with routing and responsive design`
  - Files: Wave 4 files

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| Wave 1 | `chore: setup monorepo with bun workspaces, vite, tailwind` | Root config, apps/web base |
| Wave 2 | `feat: setup tanstack router, shadcn components, theme system` | Router, components, theme |
| Wave 3 | `feat: implement landing, login, chat pages` | Page components |
| Wave 4 | `feat: complete ui prototype with routing and responsive design` | Integration, polish |

---

## Success Criteria

### Verification Commands
```bash
# Setup verification
cd apps/web && bun install && bun run build
# Expected: Exit code 0

# Dev server
cd apps/web && bun run dev
# Expected: Server starts on localhost:5173

# Page verification (via playwright)
# - Landing page renders
# - Login page renders with MFA UI
# - Chat page renders with sidebar
# - Theme toggle works
# - Responsive at all breakpoints
```

### Final Checklist
- [x] All "Must Have" present (see list above)
- [x] All "Must NOT Have" absent (no backend, no real auth)
- [x] 3 complete pages with routing
- [x] Dark/light theme toggle working
- [x] 14 shadcn/ui components installed
- [x] Responsive design implemented
- [x] Screenshots captured as evidence

---

## References

### External Documentation
- shadcn/ui: https://ui.shadcn.com/docs/installation
- TanStack Router: https://tanstack.com/router/latest/docs/framework/react/overview
- TailwindCSS: https://tailwindcss.com/docs/installation
- Bun Workspaces: https://bun.sh/docs/install/workspaces

### Pattern References
- Vercel design: https://vercel.com/design (for visual inspiration)
- Linear app: https://linear.app (for UI patterns)
- Claude Code: https://claude.ai/code (for chat interface style)
