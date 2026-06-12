# Behavior Specifications

## Status

- Discovery Phase 5 baseline documented from source analysis
- Needs interaction verification pass during implementation

## Drag and Drop (Board Movement)

### Scenario

- Move issue from one status column to another (example: TODO -> IN PROGRESS)

### Trigger

- User drags an issue card and drops into same or different column

### State Changes

- Update issue.status when moved across columns
- Recalculate issue.listPosition for affected list(s)
- Persist new ordering in client state immediately

### UI Updates

- Card appears in destination column at dropped index
- Source column removes card
- Destination column count/ordering reflects update

### Reordering Logic

- Intra-column move: reorder items by target index
- Inter-column move: remove from source array and insert in destination array
- Recompute or normalize listPosition to maintain stable sort order

### Optimistic Behavior

- Local-first update in Zustand for immediate visual feedback
- Future API sync should be optimistic with rollback on failure

### Future API Requirements

- mutation: PATCH issue status/listPosition
- conflict strategy: last-write-wins plus optional server-side sequence normalization

## Create Issue

### Trigger

- User opens create issue modal from left navigation action

### Form Fields

- title (required)
- description (optional rich text)
- type (required)
- priority (required)
- reporter (required)
- assignees (optional multi-select)

### Validation

- title non-empty
- enum fields must match known values
- reporter must exist in current user set

### Modal Behavior

- Open: focus first input
- Submit success: close modal and insert issue in board ordering
- Cancel: close modal and discard unsaved edits

### State Updates

- Add new issue into project issues list
- Initialize status to default workflow state
- Set listPosition at end of destination column by default

### Error Handling (UI-only phase)

- Schema errors shown inline
- No backend errors in current phase; keep extension point for future API failures

## Edit Issue

### Editable Fields

- title
- description
- status
- priority
- type
- reporter
- assignees

### Editing Patterns

- Inline text edits (title)
- Rich text edit mode (description)
- Dropdown/select edits for metadata

### Validation

- Keep enum values constrained
- Prevent empty title after trim

### State Updates

- Patch only changed fields in issue entity
- Maintain unchanged fields intact

### Full Page vs Modal

- Same core issue detail behavior should be shared between full route and modal context

## Search

### Board Search Flow

- User types into filter search
- Query updates filter state
- Issue lists recompute using case-insensitive contains match on title/description

### Search Drawer Flow

- User opens drawer and types query
- Results update with debounce
- Empty query state can show recent issues

### Filtering Interop

- Search combines with selected assignees, onlyMyIssues, and ignoreResolved flags

### Debouncing

- Apply short debounce for input-driven filtering to prevent unnecessary recompute thrash

## Dropdowns

### Open State

- Triggered by click or keyboard activation

### Close State

- Close on selection
- Close on outside interaction
- Close on escape key

### Keyboard Support

- Arrow navigation
- enter/space selection
- escape close

### Accessibility

- Proper roles and active descendant semantics
- Visible focus indicators

## Modals

### Open Behavior

- Trigger from explicit actions (open issue, create issue, delete confirm)

### Close Behavior

- Escape key
- backdrop click where allowed
- explicit close button/action

### Focus Handling

- Trap focus while open
- Restore focus to trigger on close

### Scroll Handling

- Prevent background scroll while open

## Comments Workflow

### Create Comment

- User enters create mode
- Types rich text comment
- Saves comment
- New comment prepended or appended based on source behavior

### State Changes

- Update issue.comments collection
- Preserve author and createdAt metadata

### Keyboard Interaction

- Source includes shortcut behavior for entering create mode
- React migration should preserve only if it does not conflict with global shortcuts

## Navigation and Layout Behavior

### Responsive Sidebar

- Desktop default expanded
- Can collapse/expand manually
- Resize/media change updates expanded state

### Loading Overlay

- Global loading indicator shown while project data is initializing

## Settings Form Workflow

### Edit Cycle

- Load current project values
- User modifies fields
- Save applies updates to project entity
- Cancel returns to previous values or navigates away

### Validation

- Required text fields and category constraints

## Behavior Risks

- DnD edge cases with filtered lists can desync visual order vs source order
- Rich text editor output format differences can affect rendering parity
- Focus/keyboard behavior can regress when replacing ng-zorro with new primitives
- Combined filters with debounced search can produce stale display if selectors are not memoized
