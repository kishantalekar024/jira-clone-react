# Migration Strategy

## Status

- Discovery Phase 1 findings documented and mapped
- Phase-based migration strategy prepared
- Implementation not started

## Build Order (Recommended)

1. Project setup and tooling
2. Theme system and design tokens
3. Shared UI primitives
4. App layouts and route skeleton
5. Screen shells
6. Feature components
7. Behaviors and workflow parity
8. Final polish and UX consistency

## Source -> Destination Mapping

### App Bootstrap and Routing

- Angular source files:
- src/main.ts
- src/app/app.routes.ts
- src/app/app.component.ts
- src/app/app.component.html
- React destination files:
- src/main.tsx
- src/app/providers/AppProviders.tsx
- src/app/router/index.tsx
- src/app/layouts/AppFrame.tsx
- Dependencies: react-router-dom, zustand, @tanstack/react-query
- Complexity: Medium
- Migration notes: preserve global loading overlay and route redirects
- Risks: route-level data hydration timing differences

### Project Layout and Navigation

- Angular source files:
- src/app/project/project.component.ts
- src/app/project/project.component.html
- src/app/project/components/navigation/\*
- React destination files:
- src/features/project/layout/ProjectLayout.tsx
- src/features/project/components/navigation/\*
- Dependencies: router hooks, shared icons, responsive hooks
- Complexity: Medium
- Migration notes: consolidate nav state and shell actions in Zustand
- Risks: responsive collapse behavior parity

### Board and Drag-and-Drop

- Angular source files:
- src/app/project/pages/board/\*
- src/app/project/components/board/board-dnd/\*
- src/app/project/components/board/board-dnd-list/\*
- src/app/project/components/issues/issue-card/\*
- React destination files:
- src/features/project/pages/board/BoardPage.tsx
- src/features/project/components/board/Board.tsx
- src/features/project/components/board/BoardColumn.tsx
- src/features/project/components/board/BoardCard.tsx
- src/features/project/lib/board-dnd.ts
- Dependencies: dnd-kit, Zustand selectors
- Complexity: High
- Migration notes: implement deterministic ordering helpers before UI wiring
- Risks: filtered DnD ordering bugs, cross-column index mismatches

### Issue Detail (Modal + Full Page)

- Angular source files:
- src/app/project/pages/full-issue-detail/\*
- src/app/project/components/issues/issue-detail/\*
- src/app/project/components/issues/issue-modal/\*
- src/app/project/components/issues/issue-delete-modal/\*
- src/app/project/components/issues/issue-title/\*
- src/app/project/components/issues/issue-description/\*
- src/app/project/components/issues/issue-comments/\*
- src/app/project/components/issues/issue-comment/\*
- src/app/project/components/issues/issue-status/\*
- src/app/project/components/issues/issue-priority/\*
- src/app/project/components/issues/issue-type/\*
- src/app/project/components/issues/issue-reporter/\*
- src/app/project/components/issues/issue-assignees/\*
- React destination files:
- src/features/project/pages/issue-detail/IssueDetailPage.tsx
- src/features/project/components/issues/IssueDetailModal.tsx
- src/features/project/components/issues/IssueDetail.tsx
- src/features/project/components/issues/sections/\*
- Dependencies: form handling, rich text editor adapter, select/dropdown primitives
- Complexity: High
- Migration notes: reuse one issue detail core component across modal and page contexts
- Risks: rich text parity and focus behavior regressions

### Create Issue

- Angular source files:
- src/app/project/components/add-issue-modal/\*
- src/app/project/components/navigation/navbar-left/\*
- React destination files:
- src/features/project/components/create-issue/CreateIssueModal.tsx
- src/features/project/components/create-issue/fields/\*
- Dependencies: react-hook-form, zod, modal primitive
- Complexity: Medium-High
- Migration notes: encode schema once and keep selectors typed
- Risks: default values and listPosition assignment drift

### Search and Filters

- Angular source files:
- src/app/project/components/search/search-drawer/\*
- src/app/project/components/search/issue-result/\*
- src/app/project/components/board/board-filter/\*
- src/app/project/state/filter/\*
- React destination files:
- src/features/project/components/search/SearchDrawer.tsx
- src/features/project/components/search/IssueResultItem.tsx
- src/features/project/components/board/BoardFilter.tsx
- src/features/project/stores/filterStore.ts
- Dependencies: Zustand, debounce utility
- Complexity: Medium
- Migration notes: keep board and drawer search behavior aligned
- Risks: stale filtered view if memoization/selectors are incorrect

### Settings

- Angular source files:
- src/app/project/pages/settings/\*
- React destination files:
- src/features/project/pages/settings/SettingsPage.tsx
- src/features/project/forms/settingsSchema.ts
- Dependencies: react-hook-form, zod
- Complexity: Low-Medium
- Migration notes: straightforward form migration
- Risks: minor validation parity differences

### WIP

- Angular source files:
- src/app/work-in-progress/\*
- React destination files:
- src/features/wip/WipPage.tsx
- Dependencies: none significant
- Complexity: Low
- Migration notes: static migration
- Risks: low

## Discovery Phases and Documentation Sync Rules

### Phase 1 (Completed)

- Scope: structure, routes, styles/theme, assets, environments
- Docs updated: implementation-plan.md, migration-strategy.md

### Phase 2

- Scope: screens and route-level composition
- Docs to update: screens.md, implementation-plan.md, todo.md

### Phase 3

- Scope: shared components and reusable primitives
- Docs to update: component-inventory.md, implementation-plan.md, todo.md

### Phase 4

- Scope: feature components (board, issue detail, create issue, search)
- Docs to update: component-inventory.md, migration-strategy.md

### Phase 5

- Scope: behaviors and workflows
- Docs to update: behaviors.md, migration-strategy.md

### Phase 6

- Scope: Angular state flow to Zustand architecture
- Docs to update: implementation-plan.md

### Phase 7

- Scope: final complexity and risk review, dependency-aware build sequence
- Docs to update: all docs as needed and finalize todo.md

## Complexity Assessment (Current)

- High: board DnD, issue detail/editing, rich text sections
- Medium: create issue, search/drawer, navigation shell
- Low: settings, wip, basic reusable primitives

## Risk Register (Current)

- Drag-and-drop parity risk during CDK -> dnd-kit migration
- Rich text editor output and rendering consistency risk
- Accessibility/focus regressions when replacing ng-zorro overlays
- State cohesion risk when splitting Akita patterns into Zustand + query hooks
- Route hydration consistency risk due to source guard/component-init split

## Dependency-aware Implementation Sequence

1. Foundation setup (tooling, aliases, providers, env)
2. Theme tokens and global styles
3. Shared UI primitives (button/input/avatar/modal/drawer/select)
4. App and project layouts with routing skeleton
5. Board read-only rendering
6. Filter/search state wiring
7. Board dnd behavior
8. Issue detail core and sub-editors
9. Create issue modal
10. Search drawer and issue quick navigation
11. Settings and WIP completion
12. Cross-screen polish and parity checks
