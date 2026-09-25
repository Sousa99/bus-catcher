# Quickstart — Bus Icon Favicon & Stop List Component Showcase (003)

**Date**: 2026-09-25

Runnable validation guide proving the component showcase and the bus favicon
work end-to-end. Details live in [research.md](research.md),
[data-model.md](data-model.md), and [contracts/](contracts/); this file is a
run guide only.

## Prerequisites

- Node 24, pnpm 11 (`pnpm install` at repo root).
- No backend, database, or network access is required — the showcase uses
  static fixtures and the favicon is a static asset.

## 1. Run the component showcase (Storybook)

```bash
pnpm --filter ./frontend storybook          # Storybook dev on http://localhost:6006
```

1. Open **StopTimesList → Docs** in the sidebar. You should see, on one page:
   - prose documenting the component's purpose, its `times` prop, and its
     states, **and**
   - interactive `<Canvas>` examples for **Mixed**, **ScheduleOnly**, and
     **Empty** (FR-003, FR-004, FR-005).
2. In the **Mixed** canvas, rows show the line badge, headsign, a delay delta
   (`+4 min` / `on time`), the arrival time, and a `Live` or `Schedule` pill
   per row — matching the SPA exactly (FR-002, SC-004).
3. In the **Empty** canvas, the list shows "No more buses scheduled today."
4. Storybook runs fully offline (FR-001) — no `/api` calls, no errors in the
   browser console.

## 2. Verify the favicon

```bash
pnpm --filter ./frontend dev                # Vite on http://localhost:5173
```

- Open http://localhost:5173 — the browser tab shows a **bus-front icon**
  instead of the default blank page (FR-006).
- Resize/zoom the tab to a small size: the icon stays legible (FR-007).
- Toggle OS dark mode: the icon remains visible (stroke colors chosen to read
  on both themes).

## 3. Static build of the showcase

```bash
pnpm --filter ./frontend build-storybook    # outputs dist-storybook/
```

- The build completes without type or bundling errors and the Docs pages are
  included in the static output.

## 4. Gates

```bash
pnpm lint && pnpm format && pnpm test && pnpm typecheck
node scripts/scaffold.mjs --check
```

All must pass before merge. No new runtime logic is introduced — Vitest
continues to cover the component states; the Storybook build and the
favicon checks above are the feature-specific validations.

## Smoke checklist

- [ ] `storybook dev` serves **StopTimesList → Docs** with prose + canvases
- [ ] **Mixed** canvas shows Live + Schedule pills per row with delay deltas
- [ ] **ScheduleOnly** canvas shows only Schedule pills
- [ ] **Empty** canvas shows the "No more buses scheduled today." state
- [ ] The showcased component is the same shared `StopTimesList` (no copy)
- [ ] Browser tab on the SPA shows the bus-front favicon
- [ ] Favicon remains legible at small tab sizes and in dark mode
- [ ] `build-storybook` completes with Docs included
- [ ] All quality gates pass