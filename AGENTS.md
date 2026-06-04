# AGENTS Guide

## Project Snapshot
- This is a static React + Vite lottery system visualizer (no backend, no API calls, no database).
- Core flow: user edits numbered inputs -> each precomputed ticket row maps indices to those values -> per-row match counts are shown.
- Primary orchestration lives in `src/App.jsx` (utilizing a state-based page router mapped via a central config in `src/config/pages.js`), not React Router.

## Architecture You Should Learn First
- `src/App.jsx`: keeps `currentPage` state and renders matching components from `LOTTO_COMPONENTS` based on `src/config/pages.js` registry.
- `src/App.jsx`: also owns global `darkMode` + sidebar open state (`isOpen`) and passes them into `Sidebar`.
- `src/config/pages.js`: central declarative registry for all pages (`PAGES`) and navigation items (`SIDEBAR_ITEMS`).
- `src/components/Sidebar.jsx`: owns navigation UX and responsive sidebar behavior (mobile slide-in, tablet collapse, desktop expand/collapse).
- `src/components/Sidebar.jsx`: applies concrete breakpoints (`<768` mobile overlay, `768-1023` auto-collapsed, `>=1024` expanded).
- `src/components/SystemInputCell.jsx`: wraps rendering for user input fields; manages keyboard triggers (`Shift+Enter/Space`), click timeouts, and double-toggle states.
- `src/components/UniversalLotto.jsx`: shared rendering engine for all lottery variants.
- `src/components/Lotto*.jsx`: thin data wrappers that pass `data`, `guarantee`, and `entries` to `UniversalLotto`.
- `src/components/LottoIcon.jsx`: shared icon renderer used by both `App` cards and `Sidebar` nav items for lottery pages.

## Data Model and Rendering Pattern
- Lottery variant files encode systems as a 2D array of **indices** (not final numbers), e.g. `src/components/Lotto6410.jsx`, `src/components/Lotto7510.jsx`.
- In `UniversalLotto`, each row uses `values[numIndex]` to resolve what is displayed.
- Inputs are initialized as sequential strings (`1..N`), then editable by the user.
- `systemName` is derived from props + data shape (`combinationSize-guarantee-finalEntries (rowCount)`).
- **Selection Triggers**: Single-click on an input toggles index selection inside `activeEntries`. Double-click sets the bonus ball (`goldenBallIndex`).
- **Validation**: Numerical entry is restricted. Max values are `49` for 6-ball systems and `52` for others. Checks for duplicates and out-of-range indexes.
- **Pasting**: Pasting space or comma-separated lists automatically distributes numbers into consecutive inputs starting from focus.

## UI/Styling Conventions
- Built with Tailwind CSS v4. Config imports live in `src/index.css` alongside `@theme inline { ... }` rules rather than a standalone `tailwind.config.js`.
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
- IDE Visual Toolbox: Keep React Buddy configuration files in `src/dev/` committed.

## Build/Release Details That Matter
- `vite.config.js` uses `vite-plugin-singlefile` and `base: './'` so output can be opened via static hosting or direct file usage.
- `vite.config.js` also runs `vite-plugin-image-optimizer`, `vite-plugin-minify`, and Terser with `drop_console`/`drop_debugger` during build.
- `scripts/package-release.mjs` fails if `dist/` is missing; always build before packaging.
- Release metadata is written to `release/manifest.json` with `entry: browser/index.html`.

## Change Guidance for Agents
- To add a new lottery system, create a data wrapper `src/components/LottoXXXX.jsx`, declare its route in `src/config/pages.js` inside `PAGES`, and map the component in `src/App.jsx`'s `LOTTO_COMPONENTS` registry.
- Keep lottery-specific components data-only; put shared behavior in `UniversalLotto`.
- Preserve index-based row semantics when editing data arrays; changing index meaning breaks displayed mappings.
- Keep this app backend-free unless explicitly requested; current design assumes fully static deployment.
