# Jira Clone Angular -> React Implementation Plan

## Status

- Current phase: Discovery Phase 3 complete; preparing implementation execution
- Phase 1 status: Completed and documented
- Phase 2 status: Completed and documented
- Phase 3 status: Completed and documented
- Implementation status: Started (Step 1 foundation setup completed)

## Migration Scope

- In scope now: UI migration architecture and discovery documentation
- Out of scope now: API integration, auth integration, tests, deployment, performance tuning, Storybook

## Target Stack

- React 19 + TypeScript + Vite + pnpm
- Routing: react-router-dom
- State: Zustand
- Server-state prep: @tanstack/react-query (no API wiring yet)
- Styling: Tailwind CSS + clsx + tailwind-merge
- Forms: react-hook-form + zod + @hookform/resolvers
- Drag and drop: @dnd-kit/core + @dnd-kit/sortable
- Utilities: date-fns + lucide-react
- Quality: ESLint + Prettier + Husky + lint-staged

## Source Architecture Summary (Angular)

### High-level Layers

- Core utilities/services/directives/styles: src/app/core
- Reusable UI controls: src/app/jira-control
- Domain models/interfaces: src/app/interface
- Primary business feature area: src/app/project
- Standalone WIP page: src/app/work-in-progress

### Runtime Bootstrap

- Standalone Angular bootstrap with router, http client, animations, Akita integrations, Quill, Sentry
- App shell includes global loading spinner and router outlet

### Routes

- /project -> lazy loaded project feature shell
- /project/board -> board screen
- /project/settings -> settings screen
- /project/issue/:issueId -> full issue detail screen
- /wip -> work in progress screen
- / -> redirect to /project

### Assets and Environment

- Mock data source: src/assets/data/project.json and src/assets/data/auth.json
- Environment apiUrl points to /assets/data in dev and prod
- Global styles import ng-zorro css + tailwind layers

### Alias Pattern

- @trungk18/_ -> src/app/_
- @trungk18/interface/_ -> src/app/interface/_

## Proposed React Architecture (Feature-based)

### Folder Structure

- src/app
- src/app/providers
- src/app/router
- src/app/layouts
- src/shared
- src/shared/ui
- src/shared/lib
- src/shared/types
- src/shared/styles
- src/features/project
- src/features/project/pages/board
- src/features/project/pages/settings
- src/features/project/pages/issue-detail
- src/features/project/components/navigation
- src/features/project/components/board
- src/features/project/components/issues
- src/features/project/components/create-issue
- src/features/project/components/search
- src/features/project/stores
- src/features/project/selectors
- src/features/project/mappers
- src/features/project/mock

### Shared Components Strategy

- Build design-system-like primitives in src/shared/ui first
- Keep feature-specific components inside feature folders
- Move only truly reusable components from features into shared/ui
- Keep icons centralized and typed, with a single icon abstraction

## Zustand Architecture (Planned)

### Store Boundaries

- useFilterStore
- Responsibilities: search term, selected assignees, onlyMyIssues, ignoreResolved

- useProjectUiStore
- Responsibilities: drawer states, modal states, active issue id, nav expansion

- useBoardStore (optional split)
- Responsibilities: drag interaction transient state and ordering helpers

### Actions

- setSearchTerm, setSelectedUserIds, toggleOnlyMyIssues, toggleIgnoreResolved
- openIssueModal, closeIssueModal, openCreateIssueModal, closeCreateIssueModal
- openSearchDrawer, closeSearchDrawer
- moveIssueBetweenColumns, reorderIssueInColumn

### Selectors / Derived Values

- selectIssuesByStatusSorted
- selectFilteredIssues
- selectIssueById
- selectRecentIssuesForSearch

## React Query Architecture (Future API-ready)

- query key: ['project'] for board/project payload
- query key: ['auth', 'current-user'] for current user
- placeholder local query functions initially read mock JSON
- future mutations: updateIssue, deleteIssue, updateIssueComment, updateProject
- optimistic update strategy documented in behaviors.md

## Theme System Spec (Phase 1 Baseline)

### Colors (from Angular Tailwind tokens)

- Primary: #0747A6
- Text: #172b4d, #42526E, #5E6C84, #8993a4
- Backgrounds: #F4F5F7, #ebecf0, #dfe1e6, #D2E5FE, #E4FCEF
- Borders: #dfe1e6, #C1C7D0, focus #4c9aff
- Semantic scales: gray/red/orange/yellow/green/teal/blue/indigo

### Typography

- Primary family: Inter UI stack (migrate to modern Inter variable if available)
- Sizes used by source: 12, 13, 14, 15, 16, 18, 20, 24, 30, 36, 48, 64 px equivalents
- Weights: 400, 500, 600, 700

### Spacing Scale

- Source spacing includes custom tokens: sidebar=240px, navbarLeft=64px
- Base step is 4px equivalent with additional 5px and 6px variants

### Radius and Shadows

- Radius: 2px, 4px, 8px, full
- Shadows: sidebar divider shadow + focus ring variants

### Layout Widths

- Sidebar fixed width behavior + content flex growth
- Board columns responsive, desktop-first shell with collapsible nav

### Component Variants (initial)

- Button: primary, secondary, text, danger
- Input: default, error, disabled
- Tag: priority/status variants
- Modal: issue detail, create issue, confirmation

## Routing Structure (React Planned)

- / -> redirect to /project/board
- /project -> Project layout route
- /project/board -> Board page
- /project/settings -> Settings page
- /project/issue/:issueId -> Full issue page
- /wip -> Work in progress page

## Feature Breakdown

### Project Layout and Navigation

- Purpose: persistent shell with left nav and content outlet
- Screens: all /project/\* routes
- Components: top icon rail, sidebar, resizer/toggle
- State: expanded/collapsed nav state
- Dependencies: router, shared icons, responsive media hooks

### Board

- Purpose: kanban workflow by issue status
- Screens: /project/board
- Components: board filter, column list, issue card, issue modal
- State: filtered issue list, DnD ordering, active issue id
- Interactions: drag/drop, card click, filtering, inline metadata changes
- Dependencies: dnd-kit, Zustand selectors, issue utils

### Issue Detail

- Purpose: full issue editing and context
- Screens: /project/issue/:issueId and issue modal variant
- Components: title, description editor, comments, status/reporter/assignee/priority/type controls
- State: selected issue and form/editing states
- Dependencies: form libs, rich text adapter (to be selected), dropdown components

### Create Issue

- Purpose: create issue from global nav action
- Screens: modal from project shell
- Components: modal form + type/priority/reporter/assignees selectors
- State: form lifecycle and modal open state
- Dependencies: react-hook-form + zod

### Search and Filters

- Purpose: global issue search and board filtering
- Screens: board + search drawer
- Components: search input, issue result list, filter chips/selectors
- State: search term, filter flags, selected assignees
- Dependencies: Zustand, debounced interactions

### Settings

- Purpose: edit project metadata
- Screens: /project/settings
- Components: settings form
- State: form state and validation status
- Dependencies: react-hook-form + zod

### WIP Page

- Purpose: static placeholder/info page
- Screens: /wip
- Components: static content blocks
- State: none
- Dependencies: shared layout styles only

## Discovery Log

- Phase 1 complete: project structure, routes, global styles, theme tokens, environment and assets documented
- Phase 2 complete: route-by-route screen composition validated and documented
- Phase 3 complete: shared component inventory normalized with React API contracts
- Phase 4 pending: deep feature-component dependency and complexity pass
- Phase 5 pending: workflow behavior verification pass
- Phase 6 pending: finalized Zustand slice design with action/selectors map
- Phase 7 pending: final risk/complexity review and dependency-ordered build lock

## Phase 2 Deliverables Completed

- Screen inventory with exact screen composition and source mapping
- Route-to-layout matrix and overlay flow mapping

## Phase 3 Deliverables Completed

- Shared UI component contract definitions (props/events/state ownership)
- Shared ownership rules between shared/ui and feature stores/forms

## Implementation Plan Execution Start

- Step 1 kickoff: foundation setup in React app
- Priority setup items:
- install and configure core dependencies (router, Zustand, React Query, Tailwind and utilities)
- create base app provider and routing skeleton
- add path aliases and env structure
- scaffold feature-based directory layout

## Implementation Execution Log

- Step 1 completed:
- dependencies installed for routing, state, data, styling, forms, dnd, and utility stack
- Tailwind wired through Vite plugin and global styles entry
- App provider layer added with QueryClientProvider
- Route tree and project layout skeleton added
- feature-based folder structure scaffolded
- base Zustand stores and query key stubs created
- env files and quality tooling scaffolding (Prettier, Husky, lint-staged) added

- Step 2 completed:
- shared UI primitives implemented (button, input, select, dropdown, modal, drawer, avatar, tooltip, tag, loader, breadcrumbs, icon)
- project navigation shell implemented (left rail, sidebar, toggle behavior)
- search drawer and create issue modal placeholder overlays wired to Zustand UI store
- board page shell implemented with filter controls and read-only status columns/cards using mock data
- route shells upgraded for settings, issue detail, and wip pages

- Step 3 completed:
- board drag and drop interaction implemented with dnd-kit sortable/droppable flow
- issue modal open/close wired via centralized UI store activeIssueId state
- delete confirmation flow wired and connected to store mutation
- board now consumes centralized project view selector and store mutations (no direct mock array access in board components)
- issue detail panel introduced with ordered subcomponents: title, description, metadata editors, comments
- full issue page and modal now share the same issue detail panel for behavior parity
- React Query bootstrap hook added to initialize store through query key flow for future API replacement

- Step 4 completed:
- create issue modal migrated to real form using react-hook-form + zod and createIssue store mutation
- search drawer migrated with issue results/recent list and click-to-open selected issue flow
- issue detail empty-state polish added for deleted/missing issues on modal and full-page routes
- keyboard/focus accessibility tightened for modal/drawer/dropdown (escape close, focus trap, focus restore)
- Angular source mock data reused directly by copying JSON assets and mapping payloads into React domain model

## Risks Identified Early

- Drag-and-drop parity from Angular CDK to dnd-kit may affect ordering consistency
- Rich-text behavior parity (description/comments) may differ by editor package
- ng-zorro modal/dropdown/drawer behavior must be replicated with accessible React primitives
- Existing Angular route hydration is split between component init and an unused guard; React must consolidate loading flow

## Unknowns

- Exact keyboard/focus behaviors for every dropdown/modal path need behavior-level validation pass
- Final React rich text editor choice pending compatibility comparison
- Some source components may have hidden coupling only visible during interactive testing
