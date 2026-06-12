# Component Inventory

## Status

- Discovery Phase 3 verification: Completed
- Shared UI inventory normalized to concrete React API contracts
- Phase 4 notes remain preliminary and will be refined later

## Shared / Reusable UI Components

### Button

- Purpose: primary and secondary action trigger
- Reusable: Yes
- Complexity: Low
- Source examples: jira-control/button, settings actions, modal actions
- Angular API evidence:
- Inputs: type, className, icon, iconSize, isWorking, isActive, disabled
- Template behaviors: icon-only styling, spinner icon when isWorking=true
- React API contract:
- Props: type, variant, size, icon, iconSize, loading, active, disabled, className, children
- Events: onClick
- State ownership: stateless; loading/active controlled by parent
- Dependencies: clsx, tailwind-merge
- Migration notes: normalize variant tokens in shared theme

### Input

- Purpose: text input and search fields
- Reusable: Yes
- Complexity: Low
- Source examples: jira-control/input, board filter search
- Angular API evidence:
- Inputs: control, containerClassName, icon, iconSize, placeholder, enableClearButton
- Template behaviors: optional leading icon, conditional clear button, form-control binding
- React API contract:
- Props: value, defaultValue, onChange, placeholder, icon, iconSize, clearable, disabled, className, containerClassName
- Events: onChange, onClear, onFocus, onBlur
- State ownership: controlled by parent form/store; optional uncontrolled fallback for simple use
- Dependencies: react-hook-form integration adapter
- Migration notes: preserve focus and error visual treatment from source styles

### Avatar

- Purpose: user identity rendering
- Reusable: Yes
- Complexity: Low
- Source examples: jira-control/avatar, assignee/reporter fields
- Angular API evidence:
- Inputs: avatarUrl, size, name, rounded, className
- Template behaviors: only renders when avatarUrl is present
- React API contract:
- Props: src, alt, size, rounded, className, fallbackText
- Events: onClick (optional passthrough)
- State ownership: stateless
- Dependencies: tooltip primitive
- Migration notes: keep fallback initials behavior

### Breadcrumbs

- Purpose: contextual route hierarchy
- Reusable: Yes
- Complexity: Low
- Source examples: board and full issue pages
- Angular API evidence:
- Inputs: items: string[]
- Template behaviors: slash separator rendering by index
- React API contract:
- Props: items (string[] or {label,to?}[])
- Events: none
- State ownership: stateless
- Dependencies: react-router-dom links
- Migration notes: keep lightweight and data-driven

### SvgIcon / Icon System

- Purpose: app-wide icon rendering abstraction
- Reusable: Yes
- Complexity: Medium
- Source examples: jira-control/svg-icon and svg-definitions
- Angular API evidence:
- Inputs: name, size, fill
- Template behaviors: sprite <use> with href derived from current URL
- React API contract:
- Props: name, size, color, className, strokeWidth
- Events: none
- State ownership: stateless
- Dependencies: lucide-react plus custom Jira-like assets where needed
- Migration notes: centralize icon mapping to avoid scattered conditionals

### Modal

- Purpose: overlay dialogs for issue detail/create/delete confirm
- Reusable: Yes
- Complexity: Medium
- Source examples: issue-modal, add-issue-modal, issue-delete-modal
- React API contract:
- Props: open, onOpenChange, title, description, size, footer, closeOnOverlay, closeOnEscape, children
- Events: onOpenChange, onClose
- State ownership: parent owns open state
- Dependencies: dialog primitive
- Migration notes: enforce focus lock and escape behavior explicitly

### Drawer

- Purpose: side panel search experience
- Reusable: Yes
- Complexity: Medium
- Source examples: search-drawer
- React API contract:
- Props: open, onOpenChange, side, width, title, closeOnOverlay, closeOnEscape, children
- Events: onOpenChange, onClose
- State ownership: parent owns open state
- Dependencies: drawer/sheet primitive
- Migration notes: preserve keyboard close and outside click close

### Select / Dropdown

- Purpose: metadata edits (status, priority, type, reporter, assignees)
- Reusable: Yes
- Complexity: Medium
- Source examples: issue-\* selectors and add-issue selectors
- React API contract:
- Props: value, onValueChange, options, multiple, placeholder, disabled, searchable, className
- Events: onValueChange, onOpenChange
- State ownership: parent owns selected value(s); component may own ephemeral open/search text
- Dependencies: popover/listbox primitive
- Migration notes: preserve keyboard navigation and typeahead where feasible

### Tooltip

- Purpose: contextual hints and compact labels
- Reusable: Yes
- Complexity: Low
- Source examples: icon and user interactions
- React API contract:
- Props: content, side, delay, children
- Events: onOpenChange (optional)
- State ownership: internal by default, optionally controlled
- Dependencies: tooltip primitive
- Migration notes: ensure mobile fallback and accessibility labels

### Tag / Badge

- Purpose: status and priority visual labels
- Reusable: Yes
- Complexity: Low
- Source examples: issue status/priority displays
- React API contract:
- Props: tone, size, icon, children, className
- Events: none
- State ownership: stateless
- Dependencies: theme token maps
- Migration notes: use semantic color mapping from source config

### Loader / Skeleton

- Purpose: loading placeholders and global activity indicators
- Reusable: Yes
- Complexity: Low
- Source examples: global spinner, issue loader component
- React API contract:
- Props: variant, size, lines, className
- Events: none
- State ownership: stateless
- Dependencies: none
- Migration notes: keep global loading overlay behavior for initial fetch

## Feature-specific Components

### Navigation Shell Components

- Components: navigation, navbar-left, sidebar, resizer
- Purpose: project shell and global actions
- Reusable: Feature-level reusable
- Complexity: Medium
- Dependencies: router, modal open actions, responsive behavior
- Migration notes: build as one coordinated layout subsystem

### BoardDnd

- Purpose: renders board columns grouped by issue status
- Reusable: No (feature specific)
- Complexity: High
- Dependencies: dnd-kit, selectors, status mapping
- Migration notes: parity-critical with source drag/drop behavior

### BoardDndList

- Purpose: per-column list, filtering, reordering and cross-column transfer
- Reusable: No
- Complexity: High
- Dependencies: dnd-kit sortable strategy, board selectors
- Migration notes: highest migration risk for state correctness

### BoardFilter

- Purpose: search and issue filtering controls
- Reusable: Partially (filter primitives can be shared)
- Complexity: Medium
- Dependencies: filter store, debounce helper
- Migration notes: keep filtering logic deterministic and testable

### IssueCard

- Purpose: compact issue preview for board/search
- Reusable: Yes within project feature
- Complexity: Medium
- Dependencies: avatars, icons, click handlers
- Migration notes: ensure draggable and clickable affordances do not conflict

### IssueDetail

- Purpose: orchestrates issue editing sections
- Reusable: Core project feature component
- Complexity: High
- Dependencies: issue-title, description, comments, metadata controls, delete modal
- Migration notes: central place for issue mutation callbacks

### IssueTitle

- Purpose: inline issue title editing
- Reusable: Feature-specific
- Complexity: Medium
- Dependencies: text input, blur/save behavior
- Migration notes: preserve save-on-blur semantics

### IssueDescription

- Purpose: rich text description editing
- Reusable: Feature-specific
- Complexity: High
- Dependencies: rich text editor adapter
- Migration notes: editor selection is a key technical decision

### IssueComments / IssueComment

- Purpose: render and create/edit comment thread items
- Reusable: Feature-specific
- Complexity: Medium
- Dependencies: editor, auth user context, date formatting
- Migration notes: includes keyboard shortcut behavior in source

### IssueStatus / IssuePriority / IssueType / IssueReporter / IssueAssignees

- Purpose: metadata display and editing controls
- Reusable: Project-feature reusable set
- Complexity: Medium
- Dependencies: select/dropdown, icon mapping, user list
- Migration notes: keep option mapping typed and centralized

### IssueDeleteModal

- Purpose: confirmation flow before deletion
- Reusable: Yes (generic confirm could be extracted)
- Complexity: Low
- Dependencies: modal primitive
- Migration notes: preserve post-delete navigation behavior

### AddIssueModal

- Purpose: create issue form orchestration
- Reusable: Feature-specific
- Complexity: High
- Dependencies: react-hook-form, zod, selector components, editor
- Migration notes: must align with Issue model and initial ordering logic

### SearchDrawer / IssueResult

- Purpose: global issue search and quick selection
- Reusable: Feature-specific
- Complexity: Medium
- Dependencies: drawer, debounced input, issue card summary
- Migration notes: implement recent-items fallback when query empty

### SettingsForm

- Purpose: edit project metadata
- Reusable: Feature-specific
- Complexity: Low-Medium
- Dependencies: form libs and validation schema
- Migration notes: straightforward migration candidate

## Candidate React Component Map

- shared/ui: Button, Input, Avatar, Tooltip, Modal, Drawer, Select, Tag, Loader, Breadcrumbs
- features/project/components/navigation: project shell pieces
- features/project/components/board: Board, BoardColumn, BoardCard
- features/project/components/issues: IssueDetail and sub-editors
- features/project/components/create-issue: CreateIssueModal and field groups
- features/project/components/search: SearchDrawer and IssueResultItem

## Shared Component Ownership Rules

- shared/ui components do not mutate feature stores directly
- open/close state for modal/drawer is owned by feature store or page component
- form values are owned by react-hook-form controllers in feature forms
- filtering/search state is owned by Zustand filter store, not input components
- domain mapping (issue type/priority/status) lives in feature mappers, not shared/ui

## Complexity Summary

- High: BoardDndList, BoardDnd, IssueDetail, IssueDescription, AddIssueModal
- Medium: BoardFilter, SearchDrawer, IssueCard, metadata selectors, navigation shell
- Low: reusable primitives, delete confirmation, static/WIP pieces
