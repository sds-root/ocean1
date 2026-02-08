# User Profile Separation & Menu Addition

## TL;DR

> **Quick Summary**: Separate user preferences from Settings into a dedicated Profile page. Add user menu dropdown in PrimarySidebar with Profile and Logout options.
> 
> **Deliverables**:
> - Remove Preferences from SettingsSubmenu
> - Add user dropdown menu in PrimarySidebar (bottom)
> - Create `/profile` route with submenu navigation
> - Profile submenu: Basic Info, Notifications, Preferences
> 
> **Estimated Effort**: Medium (New page + components)
> **Parallel Execution**: NO - Sequential dependency

---

## Context

### Current Problem
- Preferences is mixed in Settings (service-centric)
- User profile area in sidebar has no menu/interaction
- No dedicated place for user-specific settings

### New Architecture
```
PrimarySidebar (Left)
├── Service Selector
├── Nav Menu: [Resources] [Tickets] [Monitoring] [Settings]
└── User Area (Bottom)
    └── Click → Dropdown [Profile] [Logout]

Profile Page (/profile) - New Route
├── PrimarySidebar (Left) - Same as always
├── ProfileSubmenu (Middle) - New Component
│   ├── [Basic Profile Info]
│   ├── [Notifications]
│   └── [Preferences]
└── MainContent (Right) - Profile panels
    ├── BasicProfilePanel
    ├── NotificationsPanel
    └── PreferencesPanel
```

---

## Execution Strategy

### Sequential Tasks

```
Task 1: Remove Preferences from Settings
  └── Task 2: Add User Dropdown Menu to PrimarySidebar
      └── Task 3: Create Profile Page Route
          └── Task 4: Create ProfileSubmenu Component
              └── Task 5: Create Profile Content Panels
                  └── Task 6: Add shadcn/ui Dropdown Menu
                      └── Task 7: Verification & Testing
```

---

## TODOs

- [ ] 1. Remove Preferences from SettingsSubmenu

  **What to do**:
  - Modify `apps/web/src/components/settings/settings-submenu.tsx`
  - Remove 'preferences' from SettingsTab type
  - Remove Preferences menu item from menuItems array
  - Update chat.tsx to remove 'preferences' from activeSettingsTab type
  - Remove PreferencesPanel rendering from chat.tsx

  **Acceptance Criteria**:
  - [ ] Settings shows only: Cloud Accounts, Integrations
  - [ ] No Preferences option in Settings submenu
  - [ ] Build passes

- [ ] 2. Add Dropdown Menu Component

  **What to do**:
  - Install shadcn/ui dropdown-menu if not exists
  - `bunx shadcn add dropdown-menu`

  **Acceptance Criteria**:
  - [ ] DropdownMenu component available
  - [ ] No build errors

- [ ] 3. Add User Dropdown to PrimarySidebar

  **What to do**:
  - Modify `apps/web/src/components/layout/primary-sidebar.tsx`
  - Wrap user avatar area with DropdownMenu
  - Add menu items: "Profile", "Logout"
  - "Profile" navigates to `/profile`
  - "Logout" shows toast/alert (placeholder)

  **UI Structure**:
  ```
  User Area (Bottom of PrimarySidebar)
  ├── Avatar + Name (Clickable)
  └── Dropdown Menu
      ├── 👤 Profile → navigate(/profile)
      └── 🚪 Logout → toast("Logged out")
  ```

  **Acceptance Criteria**:
  - [ ] Clicking user area shows dropdown
  - [ ] Profile navigates to /profile
  - [ ] Logout shows confirmation (placeholder)
  - [ ] Visual feedback on hover

- [ ] 4. Create Profile Page Route

  **What to do**:
  - Create `apps/web/src/routes/profile.tsx`
  - Use TanStack Router pattern
  - Layout: PrimarySidebar | ProfileSubmenu | MainContent
  - State: activeProfileTab ('basic' | 'notifications' | 'preferences')

  **Acceptance Criteria**:
  - [ ] Route `/profile` accessible
  - [ ] Shows three-column layout
  - [ ] URL: `/profile`

- [ ] 5. Create ProfileSubmenu Component

  **What to do**:
  - Create `apps/web/src/components/profile/profile-submenu.tsx`
  - Similar to SettingsSubmenu
  - Menu items: Basic Info, Notifications, Preferences
  - Use Lucide icons: User, Bell, Settings

  **Acceptance Criteria**:
  - [ ] Component renders 3 menu items
  - [ ] Active state works
  - [ ] Click updates parent state

- [ ] 6. Create Profile Content Panels

  **What to do**:
  - Create `apps/web/src/components/profile/basic-profile-panel.tsx`
  - Fields: Name, Email, Avatar, Role, Department
  - Create `apps/web/src/components/profile/notifications-panel.tsx`
  - Toggles: Email alerts, Slack notifications, Ticket updates
  - Move PreferencesPanel to profile folder
  - Path: `apps/web/src/components/profile/preferences-panel.tsx`

  **Acceptance Criteria**:
  - [ ] BasicProfilePanel shows user info
  - [ ] NotificationsPanel has toggle switches
  - [ ] PreferencesPanel has display settings
  - [ ] All panels styled consistently

- [ ] 7. Update Route Tree

  **What to do**:
  - Add profile route to route tree
  - Regenerate if using TanStack Router file-based routing
  - Or add manual route definition

  **Acceptance Criteria**:
  - [ ] `/profile` route works
  - [ ] Navigation from sidebar works
  - [ ] No route errors

- [ ] 8. Final Verification

  **What to do**:
  - Test full flow: Click user → Profile → See submenu → Switch tabs
  - Verify Settings no longer has Preferences
  - Check responsive behavior

  **Acceptance Criteria**:
  - [ ] Build passes
  - [ ] No console errors
  - [ ] Settings shows 2 menu items only
  - [ ] Profile page works
  - [ ] User dropdown works

---

## Component Structure

```
profile.tsx (Route)
├── PrimarySidebar
│   └── UserDropdown (NEW)
├── ProfileSubmenu (NEW)
│   └── onSelect tab change
└── MainContent
    ├── BasicProfilePanel (NEW)
    ├── NotificationsPanel (NEW)
    └── PreferencesPanel (MOVED from settings)

primary-sidebar.tsx
├── ... existing nav ...
└── UserArea
    └── DropdownMenu (NEW)
        ├── Profile → /profile
        └── Logout
```

---

## File Changes

### Modified Files
- `apps/web/src/components/settings/settings-submenu.tsx` - Remove preferences
- `apps/web/src/routes/chat.tsx` - Remove preferences from state
- `apps/web/src/components/layout/primary-sidebar.tsx` - Add user dropdown
- `apps/web/src/routes/settings.tsx` - Delete (if still exists)

### New Files
- `apps/web/src/routes/profile.tsx` - Profile page route
- `apps/web/src/components/profile/profile-submenu.tsx` - Profile submenu
- `apps/web/src/components/profile/basic-profile-panel.tsx` - Basic info panel
- `apps/web/src/components/profile/notifications-panel.tsx` - Notifications panel
- `apps/web/src/components/profile/preferences-panel.tsx` - Moved from settings

### New shadcn Components
- `dropdown-menu` (if not exists)

---

## Success Criteria

### Functional
1. **Settings Clean**: Only Cloud Accounts + Integrations
2. **User Menu**: Dropdown appears on click
3. **Profile Route**: `/profile` accessible
4. **Submenu Works**: 3 tabs (Basic, Notifications, Preferences)

### UX
1. **Clear Separation**: Service settings vs User settings
2. **Easy Access**: Profile one click away
3. **Consistent UI**: Same patterns as Settings

### Technical
1. **Build Passes**: No TypeScript errors
2. **Route Works**: `/profile` loads correctly
3. **Clean Code**: No dead code or unused imports

---

## Navigation Flow

```
[User clicks avatar in sidebar]
         ↓
[Dropdown appears: Profile | Logout]
         ↓
[User clicks Profile]
         ↓
[Navigate to /profile]
         ↓
[Profile Page loads]
   ├── PrimarySidebar (left)
   ├── ProfileSubmenu (middle): [Basic] [Notifications] [Preferences]
   └── MainContent (right): Selected panel
```
