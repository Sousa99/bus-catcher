# Data Model — Bus Icon Favicon & Stop List Component Showcase (003)

**Date**: 2026-09-25

This feature adds no runtime data persistence and no new API. The only data
surface is the **Stop List Component**'s existing `Passing` input contract,
which drives both the SPA and the Storybook showcase. This document describes
that contract and the component's rendering states.

## Entities

### Stop List Component (`StopTimesList`)

- **What it represents**: The reusable UI that renders a stop's bus rows. It
  is consumed by the SPA dashboard (unchanged) and, in this feature, by the
  Storybook showcase (single shared implementation — FR-002).
- **Public contract**: a single prop, `times: Passing[]`.
- **State space** (FR-003):
  | State | `times` shape | Rendered outcome |
  |-------|---------------|------------------|
  | Mixed | ≥1 row with `source: 'live'` + ≥1 with `source: 'scheduled'`/absent | Each row shows line badge, headsign, delay delta, arrival time, and a `Live` or `Schedule` pill per row |
  | Schedule-only | ≥1 row, none live | All rows show the `Schedule` pill, timetable arrival time, optional delay absent |
  | Empty | `[]` | "No more buses scheduled today." paragraph (no list) |
- **Relationships**: depends on `Passing` and on the display helpers
  `formatScheduledTime` / `formatDelay` (unchanged).

### Passing (existing DTO — reused, not changed)

- **What it represents**: A single bus arrival at a stop: line, destination,
  scheduled time, and — when realtime is available — a live predicted time.
- **Fields** (from `frontend/src/api/types.ts`):
  | Field | Type | Notes |
  |-------|------|-------|
  | `tripId` | `string \| undefined` | optional |
  | `lineId` | `string` | required |
  | `lineShortName` | `string` | required; rendered in the badge |
  | `headsign` | `string` | required; destination text |
  | `directionId` | `number \| null \| undefined` | optional |
  | `scheduledAt` | `string` | required ISO-8601 UTC instant |
  | `minutesUntil` | `number` | required |
  | `source` | `'live' \| 'scheduled' \| undefined` | optional; `'live'` enables the Live pill |
  | `predictedAt` | `string \| undefined` | required when `source: 'live'` |
  | `delayMinutes` | `number \| null \| undefined` | optional; rendered as delay delta |
- **Validation rules** (existing behavior, preserved):
  - Row is "live" only when `source === 'live'` **and** `predictedAt` is
    defined (`StopTimesList.tsx:14`).
  - A live row renders `predictedAt` as its arrival time; otherwise
    `scheduledAt` (displayed via `formatScheduledTime`, Europe/Lisbon).
  - `delayMinutes` renders via `formatDelay` (`null`/`undefined` → blank
    space, no broken layout).
- **Relationships**: the fixture shapes in Storybook stories and the existing
  tests use identical `Passing` objects so the showcase and tests stay in sync.

## Storybook deliverables contract (data authored, not runtime)

- `StopTimesList.stories.tsx`: three stories — `Mixed` (live + scheduled
  rows), `ScheduleOnly`, and `Empty` — one per state above.
- `StopTimesList.mdx`: `<Meta>` bound to the CSF module and a `<Canvas>` per
  story, with prose covering purpose, props, and states (FR-005).
- No external data fetch: fixtures are static so the showcase runs offline
  (FR-001).