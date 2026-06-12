# Screen Inventory

## Status

- Discovery Phase 2 verification: Completed
- Source-based composition validated from route components and templates

## App Shell

### App Root

- Route: /
- Purpose: bootstraps app shell, global loading state, and routed content
- Layout: full viewport frame with loading overlay
- Components used: global spinner, router outlet, decorative snow layer
- States: loading true/false
- User interactions: navigation transitions
- Notes: redirects to /project in route config
- Source files:
- src/app/app.routes.ts
- src/app/app.component.ts
- src/app/app.component.html

### Project Layout Shell

- Route: /project/\*
- Purpose: persistent navigation and routed project pages
- Layout: left navigation + flexible content area
- Components used:
- project.component -> navigation + router-outlet + svg-definitions
- navigation.component -> navbar-left + sidebar + resizer
- States: nav expanded/collapsed
- User interactions: manual nav toggle, responsive collapse behavior
- Notes: data hydration triggered at project shell init in Angular source
- Source files:
- src/app/project/project.component.ts
- src/app/project/project.component.html
- src/app/project/components/navigation/navigation/navigation.component.ts
- src/app/project/components/navigation/navigation/navigation.component.html
- src/app/project/components/navigation/navbar-left/navbar-left.component.ts
- src/app/project/components/navigation/sidebar/sidebar.component.ts

## Product Screens

### Project Board

- Route: /project/board
- Purpose: main kanban board for issue management
- Layout: breadcrumbs/header, filter area, multi-column board
- Components used:
- board.component -> breadcrumbs + social links header + board-filter + board-dnd
- board-dnd.component -> 4 status columns via board-dnd-list
- board-dnd-list.component -> issue-card list + cdk drag/drop
- issue-card.component -> opens issue-modal
- States: filtered issue collections by status, active issue modal
- User interactions: drag and drop issues, click issue card, search/filter, open issue details
- Notes: highest interaction density in app
- Source files:
- src/app/project/pages/board/board.component.ts
- src/app/project/pages/board/board.component.html
- src/app/project/components/board/board-filter/board-filter.component.ts
- src/app/project/components/board/board-dnd/board-dnd.component.ts
- src/app/project/components/board/board-dnd-list/board-dnd-list.component.ts
- src/app/project/components/issues/issue-card/issue-card.component.ts
- src/app/project/components/issues/issue-modal/issue-modal.component.ts

### Project Settings

- Route: /project/settings
- Purpose: edit project metadata
- Layout: simple form page within project shell
- Components used:
- settings.component -> breadcrumbs + reactive form + j-button actions
- fields: name, url, category(select), description(textarea)
- States: form dirty/valid/invalid/saving
- User interactions: edit fields, save, cancel
- Notes: lower complexity than board and issue detail
- Source files:
- src/app/project/pages/settings/settings.component.ts
- src/app/project/pages/settings/settings.component.html

### Full Issue Detail

- Route: /project/issue/:issueId
- Purpose: detailed issue editing in full-page mode
- Layout: issue details panel with metadata and comments
- Components used:
- full-issue-detail.component -> breadcrumbs + issue-detail
- issue-detail.component sections:
- left: issue-title, issue-description, issue-comments
- right: issue-status, issue-reporter, issue-assignees, issue-priority, created/updated timestamps
- States: edit/view mode per field, comment creation mode
- User interactions: inline edit, dropdown changes, add comment, delete issue
- Notes: same domain behavior as issue modal variant
- Source files:
- src/app/project/pages/full-issue-detail/full-issue-detail.component.ts
- src/app/project/pages/full-issue-detail/full-issue-detail.component.html
- src/app/project/components/issues/issue-detail/issue-detail.component.ts
- src/app/project/components/issues/issue-detail/issue-detail.component.html

### Work In Progress

- Route: /wip
- Purpose: static placeholder/marketing information page
- Layout: static content blocks
- Components used: work-in-progress component
- States: none
- User interactions: basic links only
- Notes: low migration complexity
- Source files:
- src/app/work-in-progress/work-in-progress.component.ts
- src/app/work-in-progress/work-in-progress.component.html

## Embedded/Overlay Screens

### Issue Detail Modal Variant

- Route context: opened from /project/board
- Purpose: quick issue editing without full route transition
- Layout: modal containing issue-detail component
- Components used:
- issue-modal.component -> issue-detail wrapper
- issue-detail emits onClosed, onOpenIssue, onDelete
- issue-delete-modal used by issue-detail delete action
- States: modal open/close, selected issue id
- User interactions: open card, edit fields, close modal, delete confirm
- Notes: must stay behaviorally consistent with full issue detail page
- Source files:
- src/app/project/components/issues/issue-modal/issue-modal.component.ts
- src/app/project/components/issues/issue-detail/issue-detail.component.ts

### Create Issue Modal

- Route context: opened from left navbar action
- Purpose: create new issue
- Layout: modal form with multiple selectors and description editor
- Components used: add-issue-modal + issue-type/priority/reporter/assignee selectors
- States: form state, validation errors, submitting
- User interactions: fill form, select values, submit, cancel
- Notes: includes rich text editor behavior
- Source files:
- src/app/project/components/navigation/navbar-left/navbar-left.component.ts
- src/app/project/components/add-issue-modal/add-issue-modal.component.ts

### Search Drawer

- Route context: opened from top navigation action
- Purpose: global issue lookup and quick navigation
- Layout: side drawer with search input and issue results list
- Components used:
- search-drawer.component -> j-input + results/recent sections
- issue-result.component list item opens issue-modal
- States: drawer open/close, query string, result list
- User interactions: type search, pick issue result, close drawer
- Notes: supports recent issues fallback when query is empty
- Source files:
- src/app/project/components/navigation/navbar-left/navbar-left.component.ts
- src/app/project/components/search/search-drawer/search-drawer.component.ts
- src/app/project/components/search/issue-result/issue-result.component.ts

## Navigation Flow

- / redirects to /project
- /project redirects to /project/board
- board -> issue modal (overlay)
- board/settings/full-issue share the same project layout shell
- /wip is isolated from project shell

## Route-to-Layout Matrix

- /project/board -> ProjectLayout -> Board page
- /project/settings -> ProjectLayout -> Settings page
- /project/issue/:issueId -> ProjectLayout -> Full issue detail page
- /wip -> standalone page (no ProjectLayout)

## Data Requirements Per Screen

- Board: project issues, users, filter criteria, current user
- Settings: project metadata object
- Full issue detail: issue by id, users, comments
- Modals/drawer: selected issue id, UI open states, filtered issue list
- WIP: static content only

## Complexity Classification

- High: Project Board, Full Issue Detail, Issue Detail Modal
- Medium: Create Issue Modal, Search Drawer, Project Layout Shell
- Low: Project Settings, Work In Progress
