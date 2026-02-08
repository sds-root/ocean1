# LLM Integration Plan

## TL;DR

> **Quick Summary**: Implement real LLM chat in `apps/web` using Vercel AI SDK, connected to `apps/api` (Elysia) which streams responses from Gemini (cloud) or Ollama (local).
> 
> **Deliverables**:
> - Backend: `POST /api/chat` endpoint with streaming support
> - Frontend: Refactored `/chat` screen using `useChat` hook
> - Infrastructure: `.env` configuration for keys and provider selection
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Backend API → Frontend Integration

---

## Context

### Original Request
User wants to replace the simulated chat in `/chat` with a real LLM integration, supporting free models (Gemini) or local Ollama with streaming.

### Technical Decisions
- **SDK**: Vercel AI SDK Core (`ai`) on backend, React hooks on frontend.
- **Provider Switching**: Dynamic backend switch via `LLM_PROVIDER` env var.
- **Protocol**: Standard HTTP streaming (`text/event-stream` compatible via SDK).
- **Context Passing**: Frontend passes `selectedService` in request body; Backend injects into System Prompt.

---

## Work Objectives

### Core Objective
Enable real-time, streaming conversational AI in the existing chat interface.

### Concrete Deliverables
- `apps/api/src/routes/chat.ts` (New endpoint)
- `apps/web/src/routes/chat.tsx` (Refactored component)
- `apps/api/.env` (Configuration)

### Definition of Done
- [ ] Backend responds to `curl` with streaming text
- [ ] Frontend displays streaming tokens as they arrive
- [ ] Context (selected service) is reflected in AI responses

### Must Have
- Streaming support
- Switchable providers (Gemini/Ollama)
- Type safety (Zod validation)

### Must NOT Have
- Database persistence (Chat is ephemeral)
- Complex auth/user management (Scope limited to chat feature)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
> ALL verifications must be automated.

### Agent-Executed QA Scenarios

#### 1. Backend Stream Verification
- **Tool**: Bash (curl)
- **Scenario**: Send request to `/api/chat` and verify streaming headers/content.
- **Command**:
  ```bash
  curl -N -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages": [{"role":"user", "content":"hello"}]}'
  ```
- **Success Criteria**: HTTP 200, streaming chunks received.

#### 2. Frontend Integration Verification (Static)
- **Tool**: Bash (grep)
- **Scenario**: Confirm `useChat` implementation.
- **Command**:
  ```bash
  grep "useChat" apps/web/src/routes/chat.tsx
  ```
- **Success Criteria**: Output contains `useChat`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Setup & Backend):
├── Task 1: Install Dependencies (Web & API)
├── Task 2: Setup API Environment
└── Task 3: Implement Backend Chat Endpoint

Wave 2 (Frontend):
└── Task 4: Refactor Frontend Chat Component
```

---

## TODOs

- [x] 1. Install Dependencies


  **What to do**:
  - Install packages for both applications.
  
  **Commands**:
  - `apps/api`: `bun add ai @ai-sdk/google @ai-sdk/openai zod dotenv`
  - `apps/web`: `bun add ai`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`bash`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **Acceptance Criteria**:
  - [ ] `cd apps/api && bun pm ls @ai-sdk/google` → exit 0
  - [ ] `cd apps/web && bun pm ls ai` → exit 0

- [x] 2. Setup API Environment


  **What to do**:
  - Create `apps/api/.env` based on requirements.
  - Define: `GOOGLE_GENERATIVE_AI_API_KEY`, `LLM_PROVIDER` (default "gemini"), `OLLAMA_BASE_URL`.
  - Add `.env` to `.gitignore` if not present.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`bash`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **Acceptance Criteria**:
  - [ ] `cat apps/api/.env` → contains "LLM_PROVIDER"
  - [ ] `grep ".env" apps/api/.gitignore` → found

- [x] 3. Implement Backend Chat Endpoint


  **What to do**:
  - Modify `apps/api/src/index.ts` (or create new route file).
  - Add `POST /api/chat` route.
  - Implement factory to select `google` or `openai` (Ollama) provider based on env.
  - Read `messages` and `selectedService` from body.
  - Create system prompt: "You are a helpful assistant managing service: {selectedService}".
  - Return `streamText(...).toDataStreamResponse()`.

  **References**:
  - Vercel AI SDK Docs: `streamText`, `toDataStreamResponse`
  - Elysia Docs: Handler structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`typescript`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **Acceptance Criteria**:
  - [ ] `curl -N -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages": [{"role":"user","content":"test"}]}'` → returns 200

- [x] 4. Refactor Frontend Chat Component


  **What to do**:
  - Modify `apps/web/src/routes/chat.tsx`.
  - Remove `useState` for messages.
  - Import `useChat` from `ai/react`.
  - Initialize: `const { messages, input, handleInputChange, handleSubmit } = useChat({ api: 'http://localhost:3000/api/chat', body: { selectedService } })`.
  - Update JSX to use these values.
  - Ensure `selectedService` changes reset/update the chat context if needed (or just pass current).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (Depends on Backend for full E2E, but code can be written)
  - **Blocks**: None

  **Acceptance Criteria**:
  - [ ] `grep "useChat" apps/web/src/routes/chat.tsx` → found
  - [ ] UI builds without error (`bun --filter web build`)
