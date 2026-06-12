# Migration TODO

## Progress Snapshot

- Discovery Phase 1: [x] Completed
- Discovery Phase 2: [x] Completed
- Discovery Phase 3: [x] Completed
- Discovery Phase 4: [ ] In progress
- Discovery Phase 5: [ ] In progress
- Discovery Phase 6: [ ] In progress
- Discovery Phase 7: [ ] Not started
- Implementation: [~] In progress (Step 1 foundation started)

## Project Setup

- [x] Configure Tailwind CSS in React app
- [x] Configure design tokens from Angular theme
- [x] Configure react-router-dom route tree
- [x] Configure Zustand base stores
- [x] Configure TanStack Query provider and base query keys
- [x] Configure path aliases in tsconfig and vite
- [x] Configure environment files (.env, .env.development, .env.production)
- [x] Configure shared lint/format tooling (ESLint + Prettier)
- [x] Configure Husky + lint-staged

## Shared Components

- [x] Button
- [x] Input
- [x] Select
- [x] Dropdown
- [x] Modal
- [x] Drawer
- [x] Avatar
- [x] Tooltip
- [x] Tag/Badge
- [x] Loader/Skeleton
- [x] Breadcrumbs
- [x] Icon abstraction layer

## Layout and Routing

- [ ] App frame with global loading overlay
- [x] Project layout shell
- [x] Navigation (left rail + sidebar)
- [x] Route redirects and nested routes
- [x] WIP route

## Screens

- [x] Board page shell
- [x] Board with columns and cards (read-only)
- [x] Full issue detail page shell
- [x] Settings page
- [x] WIP page

## Feature Components

- [x] Board filter
- [x] Board DnD wiring with dnd-kit
- [x] Issue card
- [x] Issue detail subcomponents (title, description, metadata, comments)
- [x] Issue modal
- [x] Delete issue confirmation modal
- [x] Create issue modal
- [x] Search drawer
- [ ] Issue result item

## Behaviors

- [x] Drag and drop reorder in same column
- [x] Drag and drop move across columns
- [x] Create issue flow and validation
- [x] Edit issue flow and validation
- [x] Search and combined filtering
- [x] Dropdown keyboard and outside interaction handling
- [x] Modal focus trap and escape handling
- [x] Comment create/edit flow
- [x] Responsive sidebar behavior

## State and Data

- [x] Define Zustand filter store
- [x] Define Zustand project UI store
- [x] Define derived selectors for grouped/sorted/filtered issues
- [x] Add mock query layer for project/auth data
- [x] Define mutation stubs for future API integration

## Documentation Tasks

- [x] Create implementation-plan.md
- [x] Create migration-strategy.md
- [x] Create screens.md baseline
- [x] Create component-inventory.md baseline
- [x] Create behaviors.md baseline
- [x] Update docs after Discovery Phase 2 verification
- [x] Update docs after Discovery Phase 3 verification
- [ ] Update docs after Discovery Phase 4 verification
- [ ] Update docs after Discovery Phase 5 verification
- [ ] Finalize Zustand architecture section in implementation-plan.md
- [ ] Final migration review and lock build sequence

## Risk and Validation Tracking

- [ ] Validate DnD parity with filtered lists
- [ ] Validate rich text editor compatibility and output format
- [x] Validate modal/drawer focus accessibility behavior
- [ ] Validate issue ordering rules and listPosition normalization
- [ ] Validate route hydration flow consistency
