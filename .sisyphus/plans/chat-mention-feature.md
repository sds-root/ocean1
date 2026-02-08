# 채팅 컨텍스트 멘션 기능

## TL;DR

> **Quick Summary**: 채팅 화면에서 @ 입력으로 자원/티켓을 멘션하고 사이드뷰에서 선택 추가하는 기능 구현
> 
> **Deliverables**:
> - `MentionAutocomplete` 컴포넌트 (@ 입력 시 자동완성 팝업)
> - `MentionChipList` 컴포넌트 (선택된 멘션 칩 표시)
> - `useMention` 커스텀 훅 (멘션 상태 관리)
> - 수정된 `chat.tsx` (통합)
> - 수정된 `secondary-panel.tsx` (+ 버튼 추가)
> - shadcn/ui 컴포넌트 추가 (Command, Popover, Separator)
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: NO (순차적 구현)
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5

---

## Context

### Original Request
"chat 화면에서 프롬프트 입력 창에서 자원이나 티켓을 컨텍스트로 추가해서 질의하는 기능을 만들고 싶어. @ 입력으로 auto complete을 하거나 사이드뷰에서 선택해서 추가가 되어지는 화면 기능만 우선 만들어 보자."

### Interview Summary
**Key Discussions**:
- 멘션 표시 방식: 입력창 아래에 별도 표시 (Notion 스타일 칩 형태)
- 멀티 멘션: 예, 여러 개 추가 가능
- Auto Complete 동작: @ 입력 즉시 전체 목록 표시

### Research Findings
**Current Architecture**:
- `chat.tsx`: 메인 채팅 화면, useChat 훅 사용
- `mock-data.ts`: ResourceNode, Ticket 타입 및 mock 데이터
- `secondary-panel.tsx`: 자원/티켓 리스트 표시
- UI: shadcn/ui (Input, Button, Badge, Tooltip 등)
- Missing: Command, Popover 컴포넌트 (shadcn 추가 필요)

### Metis Review
**Identified Gaps** (addressed):
- Command/Popover 컴포넌트 shadcn 추가 필요
- 키보드 이벤트 핸들링 (↑↓, Enter, Esc)
- 멘션 데이터 구조 정의
- 사이드뷰 + 버튼 중복 추가 방지 로직
- 칩 삭제 기능 필요

---

## Work Objectives

### Core Objective
채팅 입력창에서 @ 입력으로 자원/티켓을 검색/선택하고, 사이드뷰에서 + 버튼으로 추가할 수 있는 멘션 기능 구현

### Concrete Deliverables
1. `src/components/chat/mention-autocomplete.tsx` - @ 입력 시 자동완성 팝업
2. `src/components/chat/mention-chip-list.tsx` - 선택된 멘션 칩 리스트
3. `src/hooks/use-mention.ts` - 멘션 상태 관리 훅
4. `src/types/mention.ts` - 멘션 관련 타입 정의
5. 수정된 `src/routes/chat.tsx` - 멘션 기능 통합
6. 수정된 `src/components/layout/secondary-panel.tsx` - + 버튼 추가
7. shadcn/ui 컴포넌트: Command, Popover, Separator

### Definition of Done
- [x] @ 입력 시 팝업이 정확한 위치에 표시됨
- [x] 팝업에서 키보드로 항목 탐색 및 선택 가능
- [x] 선택된 항목이 칩 형태로 입력창 아래에 표시됨
- [x] 칩의 X 버튼으로 개별 삭제 가능
- [x] 사이드뷰의 + 버튼으로 항목 추가 가능
- [x] 이미 추가된 항목은 중복 추가 방지됨

### Must Have
- @ 입력 Auto Complete (팝업 + 키보드 네비게이션)
- 멀티 멘션 지원
- Notion 스타일 칩 표시 (입력창 아래)
- 사이드뷰 + 버튼 추가
- 칩 삭제 기능

### Must NOT Have (Guardrails)
- 실제 API 연동 (mock 데이터 사용)
- 멘션된 항목 클릭 시 상세 정보 표시
- 드래그 앤 드롭으로 순서 변경
- 히스토리/최근 항목 기능

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (테스트 프레임워크 없음)
- **Automated tests**: NO (테스트 없음)
- **Framework**: None

**Agent-Executed QA Scenarios (MANDATORY)**:

#### Scenario 1: @ 입력 시 Auto Complete 팝업 표시
**Tool**: Playwright
**Preconditions**: Dev server running on localhost:5173
**Steps**:
1. Navigate to http://localhost:5173/chat
2. Click on Input with placeholder "Ask about Payment Service..."
3. Type "@"
4. Wait for .mention-popover (timeout: 3s)
5. Assert: Popover contains "Resources" section header
6. Assert: Popover contains "Tickets" section header
7. Assert: Popover contains resource items (at least 1)
8. Screenshot: .sisyphus/evidence/task-4-autocomplete-popup.png
**Expected Result**: Auto complete popup appears with resource and ticket sections
**Failure Indicators**: Popover not visible, missing sections, no items
**Evidence**: .sisyphus/evidence/task-4-autocomplete-popup.png

#### Scenario 2: 키보드로 항목 선택
**Tool**: Playwright
**Preconditions**: Dev server running, @ popup is open
**Steps**:
1. Type "@ec2" in input
2. Wait for filtered results (timeout: 1s)
3. Press ArrowDown key
4. Press Enter
5. Assert: Chip with text containing "ec2" is visible below input
6. Assert: Input value is cleared (only "@ec2" removed)
7. Screenshot: .sisyphus/evidence/task-4-keyboard-select.png
**Expected Result**: Selected item appears as chip below input
**Failure Indicators**: Chip not visible, input not cleared
**Evidence**: .sisyphus/evidence/task-4-keyboard-select.png

#### Scenario 3: 칩 삭제
**Tool**: Playwright
**Preconditions**: At least one chip is displayed
**Steps**:
1. Click on chip's close button (X icon)
2. Assert: Chip is no longer visible
3. Assert: Remaining chips (if any) are still visible
4. Screenshot: .sisyphus/evidence/task-5-chip-delete.png
**Expected Result**: Chip is removed from the list
**Failure Indicators**: Chip still visible, other chips affected
**Evidence**: .sisyphus/evidence/task-5-chip-delete.png

#### Scenario 4: 사이드뷰에서 + 버튼으로 추가
**Tool**: Playwright
**Preconditions**: Dev server running, SecondaryPanel visible with resources
**Steps**:
1. Navigate to /chat
2. Ensure Resources menu is active
3. Wait for resource tree to load (timeout: 3s)
4. Click first resource item's + button (Plus icon)
5. Assert: Chip with matching resource name appears below input
6. Assert: + button is now disabled or hidden for that item
7. Screenshot: .sisyphus/evidence/task-5-sidebar-add.png
**Expected Result**: Resource added as chip, + button disabled
**Failure Indicators**: Chip not added, + button still enabled
**Evidence**: .sisyphus/evidence/task-5-sidebar-add.png

#### Scenario 5: 멀티 멘션
**Tool**: Playwright
**Preconditions**: Dev server running
**Steps**:
1. Add 3 different resources via @ autocomplete
2. Assert: All 3 chips are visible below input
3. Screenshot: .sisyphus/evidence/task-5-multi-mention.png
**Expected Result**: Multiple chips displayed side by side
**Failure Indicators**: Only 1 chip visible, layout broken
**Evidence**: .sisyphus/evidence/task-5-multi-mention.png

---

## Execution Strategy

### Sequential Tasks
```
Wave 1: Infrastructure
└── Task 1: shadcn/ui 컴포넌트 추가

Wave 2: Core Components
└── Task 2: Mention 타입 및 훅 생성
└── Task 3: MentionAutocomplete 컴포넌트

Wave 3: Integration
└── Task 4: MentionChipList 컴포넌트
└── Task 5: chat.tsx 통합

Wave 4: Sidebar Enhancement
└── Task 6: secondary-panel.tsx + 버튼 추가

Critical Path: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6
```

### Dependency Matrix
| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5, 6 | None |
| 2 | 1 | 3, 4, 5 | None |
| 3 | 2 | 4, 5 | None |
| 4 | 2, 3 | 5 | None |
| 5 | 2, 3, 4 | 6 | None |
| 6 | 2, 4 | None | None |

---

## TODOs

### Task 1: shadcn/ui 컴포넌트 추가
**What to do**:
- Install shadcn/ui Command, Popover, Separator components
- Verify components are properly registered

**Must NOT do**:
- Don't modify existing components
- Don't install unnecessary dependencies

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: none
- **Reason**: Simple shadcn component installation task

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: None
- **Blocks**: Tasks 2, 3, 4, 5, 6

**Acceptance Criteria**:
- [x] Command component exists at `src/components/ui/command.tsx`
- [x] Popover component exists at `src/components/ui/popover.tsx`
- [x] Separator component exists at `src/components/ui/separator.tsx`

**Agent-Executed QA Scenario**:
```
Scenario: shadcn components installed
  Tool: Bash
  Steps:
    1. ls src/components/ui/command.tsx
    2. ls src/components/ui/popover.tsx
    3. ls src/components/ui/separator.tsx
  Expected Result: All three files exist
```

**Commit**: YES
- Message: `feat: add shadcn command, popover, separator components`
- Files: `src/components/ui/command.tsx`, `src/components/ui/popover.tsx`, `src/components/ui/separator.tsx`

---

### Task 2: Mention 타입 및 훅 생성
**What to do**:
- Create `src/types/mention.ts` with MentionItem type
- Create `src/hooks/use-mention.ts` custom hook

**Must NOT do**:
- Don't implement UI components in this task
- Don't modify chat.tsx yet

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: none
- **Reason**: Type definitions and custom hook creation

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: Task 1
- **Blocks**: Tasks 3, 4, 5

**References**:
- `src/lib/mock-data.ts:ResourceNode` - Resource structure to mirror
- `src/lib/mock-data.ts:Ticket` - Ticket structure to mirror

**Acceptance Criteria**:
- [x] MentionItem type defined with all required fields
- [x] useMention hook exports: mentions, addMention, removeMention, clearMentions
- [x] Hook prevents duplicate mentions

**Agent-Executed QA Scenario**:
```
Scenario: useMention hook works correctly
  Tool: Bash (node REPL simulation via bun)
  Steps:
    1. Create test file importing useMention
    2. Verify types compile without errors
    3. Run: bunx tsc --noEmit src/hooks/use-mention.ts
  Expected Result: No TypeScript errors
```

**Commit**: YES
- Message: `feat: add mention types and useMention hook`
- Files: `src/types/mention.ts`, `src/hooks/use-mention.ts`
- Pre-commit: `bun run --filter web lint` passes

---

### Task 3: MentionAutocomplete 컴포넌트
**What to do**:
- Create `src/components/chat/mention-autocomplete.tsx`
- Implement @ 입력 감지 및 팝업 표시
- Implement 검색 필터링
- Implement 키보드 네비게이션 (↑↓, Enter, Esc)

**Must NOT do**:
- Don't modify chat.tsx directly (export as standalone component)
- Don't implement chip rendering in this component

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: `frontend-ui-ux`
- **Reason**: Complex UI component with keyboard interactions

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: Task 2
- **Blocks**: Task 4, Task 5

**References**:
- `src/lib/mock-data.ts:mockResources` - Resource data source
- `src/lib/mock-data.ts:mockTickets` - Ticket data source
- `src/components/ui/command.tsx` - shadcn Command component
- `src/components/ui/popover.tsx` - shadcn Popover component

**Acceptance Criteria**:
- [x] Component accepts `isOpen`, `onSelect`, `onClose` props
- [x] @ 입력 시 팝업이 input 아래에 정확히 위치
- [x] Resources와 Tickets 섹션 구분 표시
- [x] 검색어 입력 시 실시간 필터링
- [x] ArrowUp/ArrowDown으로 항목 탐색
- [x] Enter로 선택, Esc로 닫기

**Agent-Executed QA Scenario**:
```
Scenario: MentionAutocomplete renders correctly
  Tool: Playwright
  Preconditions: Component is mounted in test environment
  Steps:
    1. Render MentionAutocomplete with isOpen=true
    2. Assert: Resources section visible
    3. Assert: Tickets section visible
    4. Type "ec2" in search
    5. Assert: Only matching items shown
    6. Press ArrowDown
    7. Assert: First item highlighted
    8. Press Enter
    9. Assert: onSelect callback called with correct item
  Evidence: .sisyphus/evidence/task-3-component-render.png
```

**Commit**: YES
- Message: `feat: add MentionAutocomplete component with keyboard navigation`
- Files: `src/components/chat/mention-autocomplete.tsx`
- Pre-commit: `bun run --filter web lint` passes

---

### Task 4: MentionChipList 컴포넌트
**What to do**:
- Create `src/components/chat/mention-chip-list.tsx`
- Implement chip UI (icon + name + X button)
- Implement chip 삭제 기능
- Style: Resource는 파란색, Ticket은 보라색 계열

**Must NOT do**:
- Don't integrate with chat.tsx yet
- Don't implement drag-and-drop

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: `frontend-ui-ux`
- **Reason**: UI component requiring careful styling

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: Task 2, Task 3
- **Blocks**: Task 5

**References**:
- `src/components/ui/badge.tsx` - Badge component for styling reference
- `src/components/chat/mention-autocomplete.tsx` - MentionItem type usage

**Acceptance Criteria**:
- [x] Component accepts `mentions` array and `onRemove` callback
- [x] Chips are displayed horizontally with gap
- [x] Each chip shows appropriate icon based on type
- [x] Resource chips have blue color scheme
- [x] Ticket chips have purple color scheme
- [x] X button on hover, click removes chip

**Agent-Executed QA Scenario**:
```
Scenario: MentionChipList renders chips correctly
  Tool: Playwright
  Steps:
    1. Render MentionChipList with 2 resources and 1 ticket
    2. Assert: All 3 chips visible
    3. Assert: Resource chips have blue styling
    4. Assert: Ticket chip has purple styling
    5. Hover over first chip
    6. Assert: X button visible
    7. Click X button
    8. Assert: onRemove callback called with correct ID
  Evidence: .sisyphus/evidence/task-4-chip-list.png
```

**Commit**: YES
- Message: `feat: add MentionChipList component`
- Files: `src/components/chat/mention-chip-list.tsx`
- Pre-commit: `bun run --filter web lint` passes

---

### Task 5: chat.tsx 통합
**What to do**:
- Modify `src/routes/chat.tsx`
- Integrate MentionAutocomplete into input area
- Integrate MentionChipList below input
- Connect useMention hook
- Handle @ 입력 감지 (정규식)

**Must NOT do**:
- Don't break existing chat functionality
- Don't modify message display logic

**Recommended Agent Profile**:
- **Category**: `unspecified-high`
- **Skills**: `frontend-ui-ux`
- **Reason**: Integration work requiring careful state management

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: Task 2, Task 3, Task 4
- **Blocks**: Task 6

**References**:
- `src/routes/chat.tsx` - Current implementation
- `src/hooks/use-mention.ts` - Mention state management
- `src/components/chat/mention-autocomplete.tsx` - Autocomplete component
- `src/components/chat/mention-chip-list.tsx` - Chip list component

**Acceptance Criteria**:
- [x] @ 입력 시 MentionAutocomplete 팝업
- [x] 선택 시 chip으로 MentionChipList에 추가
- [x] Chip 삭제 시 리스트에서 제거
- [x] 입력값에서 @query 부분만 제거되고 나머지 텍스트 유지
- [x] 기존 chat functionality (send message) 작동

**Agent-Executed QA Scenarios**:

```
Scenario 1: @ 입력으로 멘션 추가
  Tool: Playwright
  Preconditions: Chat page loaded
  Steps:
    1. Click chat input
    2. Type "Check status of @"
    3. Wait for autocomplete popup (timeout: 2s)
    4. Press ArrowDown + Enter
    5. Assert: Chip visible below input
    6. Assert: Input text is "Check status of "
    7. Screenshot: .sisyphus/evidence/task-5-mention-add.png
```

```
Scenario 2: 메시지 전송 시 멘션 포함
  Tool: Playwright
  Preconditions: Chip is displayed
  Steps:
    1. Type "Check this resource"
    2. Add mention via @ autocomplete
    3. Click Send button
    4. Assert: Message appears in chat history
    5. Assert: Input is cleared
    6. Assert: Chips are cleared
    7. Screenshot: .sisyphus/evidence/task-5-message-send.png
```

**Commit**: YES
- Message: `feat: integrate mention feature into chat page`
- Files: `src/routes/chat.tsx`
- Pre-commit: `bun run --filter web lint` passes

---

### Task 6: secondary-panel.tsx + 버튼 추가
**What to do**:
- Modify `src/components/layout/secondary-panel.tsx`
- Add + button to each resource/ticket item
- Implement onAddMention callback prop
- Disable + button for already-added items

**Must NOT do**:
- Don't break existing selection functionality (onSelect)
- Don't change panel layout significantly

**Recommended Agent Profile**:
- **Category**: `unspecified-low`
- **Skills**: `frontend-ui-ux`
- **Reason**: Small UI enhancement to existing component

**Parallelization**:
- **Can Run In Parallel**: NO
- **Blocked By**: Task 2, Task 4
- **Blocks**: None (final task)

**References**:
- `src/components/layout/secondary-panel.tsx` - Current implementation
- `src/hooks/use-mention.ts` - Mention state (via props)
- `src/components/ui/button.tsx` - Button component with variants

**Acceptance Criteria**:
- [x] Each resource/ticket item has + button
- [x] + button click adds item to mentions
- [x] Already-added items have disabled + button
- [x] Tooltip shows "Add to context" on hover

**Agent-Executed QA Scenario**:
```
Scenario: Sidebar + button adds mention
  Tool: Playwright
  Preconditions: Chat page loaded with Resources menu active
  Steps:
    1. Wait for resource list to load (timeout: 3s)
    2. Hover over first resource item
    3. Click + button
    4. Assert: Chip appears below chat input
    5. Assert: + button is now disabled
    6. Hover over disabled + button
    7. Assert: Tooltip shows "Already added"
    8. Screenshot: .sisyphus/evidence/task-6-sidebar-add.png
```

**Commit**: YES
- Message: `feat: add + button to sidebar for context mentions`
- Files: `src/components/layout/secondary-panel.tsx`
- Pre-commit: `bun run --filter web lint` passes

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat: add shadcn command, popover, separator components` | command.tsx, popover.tsx, separator.tsx | ls files exist |
| 2 | `feat: add mention types and useMention hook` | types/mention.ts, hooks/use-mention.ts | tsc compiles |
| 3 | `feat: add MentionAutocomplete component` | chat/mention-autocomplete.tsx | component renders |
| 4 | `feat: add MentionChipList component` | chat/mention-chip-list.tsx | component renders |
| 5 | `feat: integrate mention feature into chat page` | routes/chat.tsx | Playwright scenarios pass |
| 6 | `feat: add + button to sidebar for context mentions` | layout/secondary-panel.tsx | Playwright scenarios pass |

---

## Success Criteria

### Verification Commands
```bash
# Build check
cd apps/web && bun run build

# Lint check
cd apps/web && bun run lint

# Dev server check
cd apps/web && timeout 10 bun dev || true
```

### Final Checklist
- [x] All 6 tasks completed
- [x] All commits made with conventional commit format
- [x] All lint checks pass
- [x] Build succeeds without errors
- [x] All Playwright QA scenarios pass
- [x] Manual verification: @ 입력 → 팝업 → 선택 → 칩 표시 → 삭제
- [x] Manual verification: 사이드뷰 + 버튼 → 칩 추가
