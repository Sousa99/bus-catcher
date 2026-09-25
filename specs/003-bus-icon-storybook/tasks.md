---

description: "Task list for bus icon favicon & stop list component showcase"
---

# Tasks: Bus Icon Favicon & Stop List Component Showcase

**Input**: Design documents from `/specs/003-bus-icon-storybook/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature adds no runtime logic — the three component states are
already covered by `frontend/src/components/StopTimesList.test.tsx`. The
feature-specific validations are the Storybook build (Docs included) and
manual favicon checks in `quickstart.md`. No new test tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the Storybook toolchain is ready (no new dependencies).

- [x] T001 Verify the Storybook toolchain is present in
      `frontend/package.json` — `storybook`, `@storybook/react-vite`,
      `@storybook/addon-docs` in devDependencies and the `storybook` /
      `build-storybook` scripts exist; confirm `pnpm install` is current.
      No new packages are expected (plan Technical Context).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Storybook configuration that MUST be complete before the showcase
(US1) and its docs page (US3) can render anything.

**⚠️ CRITICAL**: No user story work involving Storybook can begin until this
phase is complete.

- [x] T002 [P] Create `frontend/.storybook/main.ts` — `framework:
      '@storybook/react-vite'`, `addons: ['@storybook/addon-docs']`, stories
      globs `'../src/**/*.mdx'` and
      `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`, and a `viteFinal` hook
      that merges the `@tailwindcss/vite` plugin via dynamic
      `await import('@tailwindcss/vite')` (top-level import fails with
      `ERR_PACKAGE_PATH_NOT_EXPORTED` — research R2). `satisfies
      StorybookConfig` from `@storybook/react-vite`.
- [x] T003 [P] Create `frontend/.storybook/preview.ts` — `import
      '../src/index.css';` (required for Tailwind v4 utility generation) and
      export a `Preview` with `tags: ['autodocs']` (research R2/R4).

**Checkpoint**: Foundation ready — `pnpm --filter ./frontend
build-storybook` loads the config without errors. A "no stories found"
warning is acceptable at this stage (stories land in US1); any config or
plugin error is a blocker.

---

## Phase 3: User Story 1 - Browse the stop list in an isolated component showcase (Priority: P1) 🎯 MVP

**Goal**: The Storybook workspace renders the shared `StopTimesList`
component per state (Mixed, ScheduleOnly, Empty) with no full app or network.

**Independent Test**: Run `pnpm --filter ./frontend storybook`, open the
**StopTimesList** stories, and confirm each of **Mixed** / **ScheduleOnly** /
**Empty** renders its rows (or the empty state) offline, with Tailwind
styling applied (colored Live/Schedule pills), using the same shared
component the SPA uses (`frontend/src/components/StopTimesList.tsx`).

> **NOTE on tests**: no new tests — the component's states are already
> covered by `frontend/src/components/StopTimesList.test.tsx`; this feature
> is declarative (CSF stories), so verification is via the Storybook build
> and the Independent Test above.

### Implementation for User Story 1

- [x] T004 [US1] Create `frontend/src/components/StopTimesList.stories.tsx` —
      CSF with a typed meta (`satisfies Meta<typeof StopTimesList>`),
      `tags: ['autodocs']`, and three `StoryObj` stories with typed `args`
      mirroring the fixtures in
      `frontend/src/components/StopTimesList.test.tsx` (contract
      `contracts/stop-times-list.md`, data-model.md states):
      - **Mixed**: ≥1 row with `source: 'live'`, `predictedAt`, and
        `delayMinutes` + ≥1 scheduled row.
      - **ScheduleOnly**: ≥1 scheduled row (no `source` / `predictedAt`).
      - **Empty**: `times: []`.
      Each story sets `args={{ times: [...] }}`; the component import MUST be
      the single shared `./StopTimesList` (FR-002 / SC-004 — no copy).

**Checkpoint**: At this point, User Story 1 is fully functional and testable
independently — all three stories render with correct pills and Tailwind
styles.

---

## Phase 4: User Story 2 - See a bus icon in the browser tab (Priority: P1)

**Goal**: The SPA shows a bus-front icon in the browser tab instead of the
default blank page icon.

**Independent Test**: Run `pnpm --filter ./frontend dev`, open
http://localhost:5173, and confirm the tab shows the bus-front icon; zoom the
tab small and toggle OS dark mode — the icon stays legible (FR-007).

### Implementation for User Story 2

- [ ] T005 [P] [US2] Create `frontend/public/favicon.svg` — Lucide
      `bus-front` icon (ISC; path data from
      `raw.githubusercontent.com/lucide-icons/lucide/main/icons/bus-front.svg`),
      self-contained (~1KB), 24×24 `viewBox`, explicit stroke colors
      replacing `currentColor` (light-theme color chosen to also read on
      dark, since Safari ignores media queries in SVG favicons — research
      R6), no scripts/animation/external resources.
- [ ] T006 [US2] Add the favicon link to `frontend/index.html`:
      `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` in the
      `<head>` (contract `contracts/stop-times-list.md`, research R5).
      Depends on T005.

**Checkpoint**: At this point, User Story 2 works independently — the SPA tab
shows the bus icon.

---

## Phase 5: User Story 3 - Read documentation next to a live example (Priority: P2)

**Goal**: The **StopTimesList → Docs** page shows written documentation
(purpose, props, states) alongside an interactive `<Canvas>` for each story
on one page.

**Independent Test**: In the running Storybook, open **StopTimesList →
Docs** and confirm prose describing purpose / `times` prop / states is
visible together with an interactive canvas for **Mixed**, **ScheduleOnly**,
and **Empty** (FR-003, FR-004, FR-005, SC-003).

### Implementation for User Story 3

- [ ] T007 [US3] Create `frontend/src/components/StopTimesList.mdx` — import
      `{ Canvas, Meta }` from `@storybook/addon-docs/blocks` (the only valid
      v9 path — research R3); `<Meta of={Stories} />` bound to the CSF module
      exports from `./StopTimesList.stories`; prose sections for purpose,
      props, and states; and one `<Canvas of={Stories.Mixed} />`,
      `<Canvas of={Stories.ScheduleOnly} />`, and
      `<Canvas of={Stories.Empty} />`. Depends on T004.

**Checkpoint**: At this point, User Stories 1, 2, AND 3 are all independently
functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and quality gates across all user stories.

- [ ] T008 [P] Run the `quickstart.md` validation end-to-end: `pnpm
      --filter ./frontend storybook` (Docs page renders), `pnpm --filter
      ./frontend build-storybook` (Docs included, no errors), and the SPA
      favicon check via `pnpm --filter ./frontend dev`.
- [ ] T009 [P] Run all quality gates and confirm no regressions:
      `pnpm lint && pnpm format && pnpm test && pnpm typecheck`, `node
      scripts/scaffold.mjs --check`, and `pnpm --filter ./frontend build` to
      prove the SPA runtime bundle is unaffected by Storybook (storybook is
      dev-only, never in the app bundle).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS US1 and US3.
- **User Story 1 (US1)**: Depends on Foundational — no dependency on US2/US3.
- **User Story 2 (US2)**: No dependency on Storybook or other stories — can
  start immediately after Setup (independent files: `public/`, `index.html`).
- **User Story 3 (US3)**: Depends on Foundational AND US1's stories (the MDX
  `<Canvas>` references the CSF stories).
- **Polish (Final Phase)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational (Phase 2); no deps on other stories.
- **User Story 2 (P1)**: Starts after Setup (Phase 1); fully independent of US1/US3.
- **User Story 3 (P2)**: Starts after Foundational and US1; depends on the CSF stories from T004.

### Within Each User Story

- Story-specific files before their consumers (favicon asset before the
  `index.html` link; CSF stories before the MDX docs page).
- Story complete before moving to next priority.

### Parallel Opportunities

- T002 and T003 (Foundational) are different files — can run in parallel.
- US2 (T005, T006) touches only `frontend/public/` and `frontend/index.html`
  — can run in parallel with US1 (T004) and US3 (T007).
- T008 and T009 (Polish) can run in parallel.

---

## Parallel Example: User Story 2 with the Showcase

```bash
# Launch the favicon and the showcase stories together (different files):
Task: "T004 [US1] Create frontend/src/components/StopTimesList.stories.tsx"
Task: "T005 [P] [US2] Create frontend/public/favicon.svg"
```

```bash
# Then, independently:
Task: "T006 [US2] Add favicon link to frontend/index.html"
Task: "T007 [US3] Create frontend/src/components/StopTimesList.mdx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (Storybook config — blocks the showcase).
3. Complete Phase 3: User Story 1 (showcase stories).
4. **STOP and VALIDATE**: Open Storybook and confirm the three states render
   offline with Tailwind styles.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Storybook boots cleanly.
2. Add User Story 1 → stories render per state (MVP).
3. Add User Story 2 → bus favicon in the SPA tab (independent increment).
4. Add User Story 3 → documented Docs page with canvases.
5. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1 (showcase stories).
   - Developer B: User Story 2 (favicon) — fully independent.
3. After US1: Developer A continues with User Story 3 (MDX docs).

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story is independently completable and testable.
- No new runtime logic is introduced, so the existing component tests remain
  the test suite; verification is via Storybook build and `quickstart.md`.
- Verify `build-storybook` succeeds before merge (Docs must be included).
- Commit after each task or logical group.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that
  break independence.