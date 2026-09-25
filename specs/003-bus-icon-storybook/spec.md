# Feature Specification: Bus Icon Favicon & Stop List Component Showcase

**Feature Branch**: `003-bus-icon-storybook`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "switch the favicon, i want a icon with a bus or something. and i also want you to develop storybook and components. the component is just one. it is the list of stops. the same you show on the spa. storybook should have addon docs, .mdx files with canvas and some documentation around the published component"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the stop list in an isolated component showcase (Priority: P1)

As a developer, I can open a dedicated component workspace and see the same
"list of stops" component that the SPA dashboard renders — the rows of buses
with their line, destination, delay, arrival time, and Live/Schedule label —
without having to start the full application or depend on live data. I can
step through each state of the list (mixed live and scheduled, schedule-only,
and empty / no more buses) one at a time.

**Why this priority**: This is the core of the requested work — a standalone
home for the stop list component. It lets the component be built, reviewed,
and verified in isolation, which is the main value requested.

**Independent Test**: Can be fully tested by opening the component workspace,
selecting a state of the stop list, and confirming the rendered rows match
what the SPA shows for the same data.

**Acceptance Scenarios**:

1. **Given** the component workspace, **When** I open it, **Then** I can view
   the stop list component rendered without running the full application.
2. **Given** the component workspace, **When** I select a state, **Then** the
   list renders that state (e.g. a mix of Live and Schedule rows) with no
   errors.
3. **Given** the component in the workspace, **When** I compare it to the SPA,
   **Then** it is the same component the SPA uses — there is a single shared
   implementation, not a duplicated copy.

---

### User Story 2 - See a bus icon in the browser tab (Priority: P1)

As a visitor to the application, I see a bus icon in my browser tab (favicon)
instead of the default blank page icon, so the app is instantly recognizable
as a transit tool.

**Why this priority**: It is the first branded element a user sees; it is
small, independent, and delivers immediate polish.

**Independent Test**: Can be fully tested by opening the SPA in a browser and
confirming the tab shows a bus icon rather than the default icon.

**Acceptance Scenarios**:

1. **Given** I open the application in a browser, **When** the page loads,
   **Then** the browser tab displays a bus icon favicon.
2. **Given** the bus favicon, **When** the tab is small or the icon is
   rendered at a small size, **Then** the bus symbol remains legible and
   recognizable.

---

### User Story 3 - Read documentation next to a live example (Priority: P2)

As a developer, when I open a state of the stop list in the component
workspace, I can read written documentation about the component and its props
directly alongside a live, interactive example of it. The documentation
explains what the component does, its states, and how to use it, without
switching between separate views.

**Why this priority**: Documented, self-explanatory components raise the value
of the showcase, but the showcase and favicon work first; documentation
completes the story.

**Independent Test**: Can be fully tested by opening a component's
documentation page in the workspace and confirming that narrative
documentation and a live interactive example are visible together.

**Acceptance Scenarios**:

1. **Given** the component workspace, **When** I open the documentation for
   the stop list, **Then** I see written documentation alongside an embedded,
   interactive example of the component (a canvas).
2. **Given** the documentation, **When** I read it, **Then** it describes the
   component's purpose, its props, and its states.
3. **Given** a documented example, **When** I interact with it (for example by
   selecting a story variant), **Then** the embedded example updates to match.

---

### Edge Cases

- The stop list is empty (no more buses scheduled today): the workspace shows
  the "No more buses scheduled today." state, matching the SPA.
- Schedule-only data: rows show the Schedule label, and no Live pill appears.
- Mixed data: some rows show Live and others Schedule within the same list.
- Delay present vs. absent: rows render the delay text when available and
  blank space when it is not, without layout breakage.
- The workspace shows a component that is out of date relative to the SPA:
  the shared single implementation prevents divergence — any change is visible
  in both places.
- The favicon must not break when a browser caches it: users who visited
  before may still see the old icon until their cache refreshes (acceptable,
  non-blocking).
- Invalid or missing favicon asset: the app still loads and falls back to the
  default icon, never an error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a runnable component workspace in which
  the stop list component is displayed in isolation, without starting the full
  application or requiring live network data.
- **FR-002**: The component shown in the workspace MUST be the same shared
  component the SPA dashboard renders; the workspace MUST NOT contain a
  separate or duplicated implementation.
- **FR-003**: The workspace MUST demonstrate the stop list across its states —
  mixed live/scheduled rows, schedule-only rows, and the empty "no more buses"
  state.
- **FR-004**: The workspace MUST render written documentation for the stop
  list component alongside a live, interactive example of it, visible on the
  same page.
- **FR-005**: The documentation MUST explain the component's purpose, its
  inputs (props), and its states, so a developer can use it without reading
  the source.
- **FR-006**: The SPA MUST display a bus icon as its browser-tab favicon.
- **FR-007**: The favicon MUST be legible at typical browser-tab sizes and
  MUST render correctly in current browsers.
- **FR-008**: The component workspace MUST run on the frontend's existing
  tooling and conventions, so it stays in sync with the SPA's build and test
  gates.

### Key Entities *(include if feature involves data)*

- **Stop List Component**: The reusable UI that renders a stop's bus rows —
  each row showing line, destination/headsign, delay, arrival time, and a
  Live/Schedule attribute. It is consumed by both the SPA dashboard and the
  component workspace.
- **Passing**: The data item a row renders: line id and short name, headsign,
  scheduled time, predicted (live) time, delay minutes, and source
  (`live`/`scheduled`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can open the component workspace and view the stop
  list rendered within 1 minute of starting the workspace, without running the
  full application.
- **SC-002**: Every state of the stop list (mixed, schedule-only, empty) is
  demonstrable in the workspace with a live, interactive example.
- **SC-003**: Every state shown in the workspace is accompanied by written
  documentation visible on the same page as the example.
- **SC-004**: The stop list rendered in the workspace behaves identically to
  the one rendered in the SPA, since both use a single shared implementation
  with no divergence.
- **SC-005**: A user opening the SPA in a current browser sees a bus icon in
  the tab — verified in at least one evergreen browser.

## Assumptions

- The "list of stops" is the stop times list the SPA dashboard already shows:
  rows of buses with line, headsign, delay, arrival time, and Live/Schedule
  label.
- The component workspace is built with Storybook, as requested, using its
  docs addon; documentation pages are authored as MDX files that embed an
  interactive canvas next to prose.
- The favicon is a bus icon; the specific icon asset (style, color, source)
  is chosen during planning. A simple, recognizable bus silhouette is the
  expected default.
- The workspace is a developer tool: it does not ship to end users and is not
  part of the public SPA bundle.
- The workspace is documented and verified through the project's existing
  quality gates (lint, typecheck, tests) like any other frontend code.
- The frontend already depends on React, Vite, and Tailwind; the workspace
  reuses those conventions rather than introducing new framework choices.