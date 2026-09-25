# Implementation Plan: Bus Icon Favicon & Stop List Component Showcase

**Branch**: `003-bus-icon-storybook` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-bus-icon-storybook/spec.md`

## Summary

Two deliverables. (1) **Component showcase**: stand up Storybook 9
(`@storybook/react-vite` + `@storybook/addon-docs`, both already in
devDependencies) for the SPA frontend and publish the existing
`StopTimesList` component — the "list of stops" shown on the dashboard — as
three stories (**Mixed**, **ScheduleOnly**, **Empty**) with an MDX docs page
that places prose next to interactive `<Canvas>` examples. The showcased
component is the single shared `src/components/StopTimesList.tsx`, fixtures
mirror the existing tests, and no runtime code is touched. (2) **Favicon**:
add a Lucide `bus-front` SVG (ISC) to `frontend/public/favicon.svg` and
reference it from `frontend/index.html`. Storybook needs a `viteFinal` hook
to apply the Tailwind v4 plugin (CJS-require limitation in `main.ts`) and a
`preview.ts` importing `src/index.css`.

## Technical Context

**Language/Version**: Node 24, TypeScript 5.7 (strict), React 19, Vite 6.

**Primary Dependencies**: already installed — `storybook@^9.1.20`,
`@storybook/react-vite@^9.1.20`, `@storybook/addon-docs@^9.1.20`; plus
existing `@tailwindcss/vite`, `@vitejs/plugin-react`. No new packages.

**Storage**: N/A — a static SVG asset (`public/favicon.svg`) and story/MDX
source files; no runtime storage or API.

**Testing**: Vitest + Testing Library (existing). No new runtime logic; the
existing `StopTimesList.test.tsx` already covers the three states. The
feature-specific validations are the `storybook build` (Docs included) and
manual favicon checks in `quickstart.md`.

**Target Platform**: evergreen browsers (Chrome/Firefox/Safari); Storybook
dev/build on localhost.

**Project Type**: web application (React SPA) exposing a component library
(`@sousa99/bus-catcher-components`, `build:lib`).

**Performance Goals**: Storybook dev startup is acceptable; favicon stays
~1KB; zero runtime perf impact on the SPA (favicon is a static asset,
stories are dev-only and excluded from the app bundle).

**Constraints**: the showcase MUST use the same `StopTimesList` the SPA uses
(FR-002, SC-004 — no duplicate); Storybook MUST not be added to the SPA
bundle; Tailwind v4 utilities MUST render inside Storybook (viteFinal +
preview import); favicon MUST be legible at tab size and in dark mode
(FR-007); all quality gates pass before merge.

**Scale/Scope**: one component (StopTimesList) + one favicon asset; no
backend, no schema, no new runtime code.

## Constitution Check

*GATE: must pass before implementation.*

- **I Location-Scoped Data**: untouched — the showcase is presentation-only;
  `StopTimesList` consumes already-resolved per-stop `Passing[]`; no queries
  added. ✅
- **II Freshness-Aware Realtime**: preserved — story fixtures are static and
  the component's Live/Schedule attribution logic is unchanged; no data
  freshness surfaces are altered. ✅
- **III Provider Abstraction**: untouched; no provider or service-layer
  changes. ✅
- **IV Test-First (NON-NEGOTIABLE)**: no new runtime logic is introduced —
  the feature is declarative (Storybook config, CSF stories, MDX, one static
  SVG). Existing component tests cover the three states; the Storybook build
  and favicon checks are the feature validations. Any logic added during
  implementation (e.g. a story helper) MUST be test-first. ✅
- **V Observability & Correct Time Handling**: untouched; no logging or time
  code changes. ✅
- **Data & Integration Constraints**: no data ingestion, caching, or PII;
  REST/MCP service layer unaffected. ✅
- **Quality gates**: `pnpm lint`, `pnpm format`, `pnpm test`,
  `pnpm typecheck`, `node scripts/scaffold.mjs --check` all pass before merge. ✅
- **Complexity**: one new config directory (`.storybook/`) and a favicon are
  the minimum for the requested deliverables; no unjustified layering. No
  gate violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-bus-icon-storybook/
├── plan.md              # This file
├── research.md          # Storybook 9 / Tailwind / MDX / favicon decisions
├── data-model.md        # Passing DTO + StopTimesList states
├── quickstart.md        # Run guide (showcase + favicon + gates)
├── contracts/
│   └── stop-times-list.md  # Published component + docs contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # (/speckit.tasks output)
```

### Source Code (repository root)

```text
frontend/
├── index.html                     # + <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
├── public/
│   └── favicon.svg                # NEW: Lucide bus-front icon (ISC), fixed stroke colors,
│                                  #   24×24 viewBox, prefers-color-scheme block, ~1KB
├── .storybook/
│   ├── main.ts                    # NEW: framework '@storybook/react-vite',
│   │                              #   addons ['@storybook/addon-docs'],
│   │                              #   stories globs incl. ../src/**/*.mdx,
│   │                              #   viteFinal -> await import('@tailwindcss/vite')
│   └── preview.ts                 # NEW: import '../src/index.css'; tags: ['autodocs']
└── src/
    └── components/
        ├── StopTimesList.tsx      # unchanged — single shared implementation
        ├── StopTimesList.test.tsx # unchanged — covers the three states
        ├── StopTimesList.stories.tsx  # NEW: CSF — Mixed / ScheduleOnly / Empty (typed args)
        └── StopTimesList.mdx      # NEW: docs page, <Meta of={Stories}> + <Canvas of={...}>
                                   #      per story + prose (purpose, props, states)
```

**Structure Decision**: frontend-only change, Option 2 (web application). The
Storybook config lives in `frontend/.storybook/` (Storybook's required
location), stories/MDX colocate with their component per Storybook
convention, and the favicon lives in Vite's `public/` for stable, un-hashed
URLs. No backend or package-workspace changes.

## Complexity Tracking

No constitution violations to justify. The `.storybook/` directory is
Storybook's fixed location; the `viteFinal` hook is required because
`@tailwindcss/vite` has no CJS entry (top-level import in `main.ts` fails)
and auto-merge is known-flaky in SB9; the preview CSS import is required for
Tailwind v4 utility generation. These are the minimum moving parts for the
requested deliverables.