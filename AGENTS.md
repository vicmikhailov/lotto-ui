# AGENTS Guide

## Project Snapshot
- This is a static React + Vite lottery system visualizer (no backend, no API calls, no database).
- Core flow: user edits numbered inputs -> each precomputed ticket row maps indices to those values -> per-row match counts are shown.
- Primary orchestration lives in `src/App.jsx` (state-based page routing + page registry), not React Router.

## Architecture You Should Learn First
- `src/App.jsx`: keeps `currentPage` state and renders page components from a local map.
- `src/App.jsx`: also owns global `darkMode` + sidebar open state (`isOpen`) and passes them into `Sidebar`.
- `src/components/Sidebar.jsx`: owns navigation UX and responsive sidebar behavior (mobile slide-in, tablet collapse, desktop expand/collapse).
- `src/components/Sidebar.jsx`: applies concrete breakpoints (`<768` mobile overlay, `768-1023` auto-collapsed, `>=1024` expanded).
- `src/components/UniversalLotto.jsx`: shared rendering engine for all lottery variants.
- `src/components/Lotto*.jsx`: thin data wrappers that pass `data`, `guarantee`, and `entries` to `UniversalLotto`.
- `src/components/LottoIcon.jsx`: shared icon renderer used by both `App` cards and `Sidebar` nav items for lottery pages.

## Data Model and Rendering Pattern
- Lottery variant files encode systems as a 2D array of **indices** (not final numbers), e.g. `src/components/Lotto6410.jsx`, `src/components/Lotto7510.jsx`.
- In `UniversalLotto`, each row uses `values[numIndex]` to resolve what is displayed.
- Inputs are initialized as sequential strings (`1..N`), then editable by the user.
- `systemName` is derived from props + data shape (`combinationSize-guarantee-finalEntries (rowCount)`).

## UI/Styling Conventions
- Prefer shadcn/ui primitives from `src/components/ui/*` (`button`, `card`, `badge`, `separator`).
- Use `cn()` from `src/lib/utils.js` for class composition (`clsx` + `tailwind-merge`); do not hand-roll class joins.
- `UniversalLotto` uses responsive grid classes + dynamic `gridTemplateColumns` for per-row number buttons.
- Match count badges are intentionally color-coded by state (full match / guarantee / over-guarantee) in `UniversalLotto`.
- Theme switching is class-based: `App` toggles `document.documentElement` `dark` class, while `Sidebar` provides the mode toggle control.
- Page transitions use `animate-in fade-in duration-500` wrappers in `App`.

## Developer Workflows
- Install: `npm install`
- Local dev: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Package browser artifact: `npm run package:browser` (copies `dist/` -> `release/browser/`)
- Full release flow: `npm run release` (build + package)

## Build/Release Details That Matter
- `vite.config.js` uses `vite-plugin-singlefile` and `base: './'` so output can be opened via static hosting or direct file usage.
- `vite.config.js` also runs `vite-plugin-image-optimizer`, `vite-plugin-minify`, and Terser with `drop_console`/`drop_debugger` during build.
- `scripts/package-release.mjs` fails if `dist/` is missing; always build before packaging.
- Release metadata is written to `release/manifest.json` with `entry: browser/index.html`.

## Change Guidance for Agents
- For new lottery systems, add a new `src/components/LottoXXXX.jsx` data wrapper and register it in `src/App.jsx` + sidebar navigation.
- Keep lottery-specific components data-only; put shared behavior in `UniversalLotto`.
- Preserve index-based row semantics when editing data arrays; changing index meaning breaks displayed mappings.
- Keep this app backend-free unless explicitly requested; current design assumes fully static deployment.
