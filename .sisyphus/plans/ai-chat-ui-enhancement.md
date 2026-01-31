# AI Chat UI Enhancement - Service & Resource Management

## TL;DR

> **Refactor Chat UI to support multi-service context, resource tree, and ticket management.**
>
> **Deliverables**:
> - Mock data for services, resources, tickets
> - 2-column sidebar layout (Service Selector + Context Panel)
> - Enhanced Chat Page
>
> **Estimated Effort**: Medium (1 day)
> **Parallel Execution**: YES - 2 waves

---

## Work Objectives

### Core Objective
Transform the simple chat interface into a professional DevOps dashboard with service context switching and resource management capabilities.

### Concrete Deliverables
- `src/lib/mock-data.ts`: Mock data structure
- `src/components/layout/primary-sidebar.tsx`: Service selector & main nav
- `src/components/layout/secondary-panel.tsx`: Resource tree & ticket list
- Updated `src/routes/chat.tsx`: Integrated layout

### Must Have
- Service switching capability (Payment / Auth / Inventory)
- Collapsible resource tree view (AWS / K8s group)
- Ticket list view with status badges
- Responsive layout (Mobile drawer support)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Data & Components):
├── Task 1: Create Mock Data
├── Task 2: Implement Primary Sidebar
└── Task 3: Implement Secondary Panel

Wave 2 (Integration):
└── Task 4: Integrate into Chat Page & Polish
```

---

## TODOs

### Wave 1: Data & Components

- [x] **1. Create Mock Data**

  **What to do**:
  - Create `apps/web/src/lib/mock-data.ts`
  - Define types: `Service`, `ResourceNode`, `Ticket`
  - Export mock data: `mockServices`, `mockResources`, `mockTickets`
  - Use the data structure discussed (Service > Folder > Resource)

  **Reference Content**:
  ```typescript
  // Use the code block prepared in the conversation history
  // services: Payment, Auth, Inventory
  // resources: AWS (EC2, RDS), K8s (Pods)
  ```

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`

- [x] **2. Implement Primary Sidebar**

  **What to do**:
  - Create `apps/web/src/components/layout/primary-sidebar.tsx`
  - **Service Selector**: Use shadcn `Select` to switch services
  - **Nav Menu**: Vertical list of icon buttons (Resources, Tickets, Monitoring, Settings)
  - **User Profile**: Bottom section
  - Props: `selectedService`, `onServiceChange`, `activeMenu`, `onMenuChange`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

- [x] **3. Implement Secondary Panel**

  **What to do**:
  - Create `apps/web/src/components/layout/secondary-panel.tsx`
  - **Resource View**: Use shadcn `Accordion` for nested tree structure. Show status icons (green/red dots).
  - **Ticket View**: List of cards with title, ID, status badge.
  - Render content based on `activeMenu` prop.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

### Wave 2: Integration

- [x] **4. Integrate into Chat Page**

  **What to do**:
  - Refactor `apps/web/src/routes/chat.tsx`
  - Replace existing sidebar with `PrimarySidebar` + `SecondaryPanel`
  - Manage state: `currentServiceId`, `currentMenu`
  - Ensure layout is responsive (flex-row on desktop, sheet/drawer on mobile)
  - Pass selected service context to AI messages (mock logic)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

---

## Success Criteria

### Verification
```bash
# Build check
cd apps/web && bun run build

# UI Verification (Manual/Playwright)
1. Open /chat
2. Select "Payment Service" -> Resource Panel updates
3. Select "Auth Service" -> Resource Panel changes
4. Click "Tickets" menu -> Ticket list appears
5. Mobile view -> Sidebar opens as drawer
```
