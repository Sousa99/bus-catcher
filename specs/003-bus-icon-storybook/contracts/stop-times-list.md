# Contract — Stop List Component (`StopTimesList`)

**Date**: 2026-09-25

The public UI contract of the stop list component, shared by the SPA and the
Storybook showcase. This is the interface the feature publishes and documents;
implementation specifics live in `tasks.md`.

## Component signature

```
StopTimesList({ times: Passing[] })
```

- Pure presentational component: no data fetching, no internal state, no
  side effects.
- `times` order is preserved as provided (the dashboard pre-sorts by arrival).
- Rendering is deterministic for a given `times` value.

## Props

| Prop | Type | Required | Contract |
|------|------|----------|----------|
| `times` | `Passing[]` | yes | The bus rows to render; see [data-model.md](../data-model.md) for the `Passing` shape |

## Behaviors

1. **Empty list** (`times.length === 0`): renders the single paragraph
   "No more buses scheduled today." with no list and no rows.
2. **Row rendering**: each row renders the line badge (`lineShortName`), the
   headsign, a delay delta (when `delayMinutes` is set, formatted by
   `formatDelay` — else blank space), the arrival time, and exactly one
   attribute pill.
3. **Live/scheduled attribution** (FR-002 of spec 002, preserved):
   - `source === 'live'` **and** `predictedAt` defined → arrival time is
     `predictedAt`, pill is **Live** (emerald).
   - otherwise → arrival time is `scheduledAt`, pill is **Schedule** (amber).
   - Every rendered row MUST show one of the two pills; never an unlabelled
     time.
4. **Stable keys**: row key is `${lineId}-${scheduledAt}`; duplicate rows
   (same line + time) are not expected from the backend contract.

## Rendered output (text content)

For a row: `lineShortName`, `headsign`, delay delta text (`"+4 min"`,
`"-2 min"`, `"on time"`, or empty), `HH:MM` arrival time (Europe/Lisbon),
and `Live` / `Schedule`.

## Storybook docs contract (this feature)

The published documentation MUST satisfy:

- `StopTimesList.stories.tsx` exposes exactly the three states as stories —
  `Mixed`, `ScheduleOnly`, `Empty` — each with typed `args`.
- `StopTimesList.mdx` renders, on one page, written documentation (purpose,
  props, states) alongside an interactive `<Canvas>` for each story (FR-004,
  FR-005, SC-003).
- The showcased component is the single shared implementation imported from
  `src/components/StopTimesList.tsx` — no duplicated copy (FR-002, SC-004).

## Favicon contract

- `frontend/index.html` references the favicon via
  `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` (FR-006).
- `frontend/public/favicon.svg` is a bus-front icon, ~1KB, self-contained
  (no scripts/external resources), with a 24×24 viewBox, explicit stroke
  colors readable in light and dark themes, and no animation (FR-007).