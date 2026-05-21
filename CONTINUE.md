# lotto-ui Project Guide

This document provides essential context and guidelines for continuing development on the lotto-ui project.

## Project Overview

This is a **static React + Vite lottery system visualizer** with no backend, API calls, or database. The application allows users to edit numbered inputs, and each precomputed ticket row maps those indices to values, showing per-row match counts.

### Core Flow

1. User edits numbered inputs (initially sequential `1..N`)
2. Each precomputed ticket row uses those indices to resolve displayed values
3. Match counts are shown per row, color-coded by state (full match / guarantee / over-guarantee)

## Architecture

### Primary Components

| Component | Role |
|-----------|------|
| `src/App.jsx` | State-based page routing + page registry (NOT React Router) |
| `src/components/Sidebar.jsx` | Navigation UX + responsive sidebar behavior (mobile slide-in, tablet collapse, desktop expand/collapse) |
| `src/components/UniversalLotto.jsx` | Shared rendering engine for all lottery variants |
| `src/components/Lotto*.jsx` | Thin data wrappers that pass `data`, `guarantee`, and `entries` to `UniversalLotto` |

### Data Model

- Lottery variant files encode systems as a 2D array of **indices** (not final numbers)
- In `UniversalLotto`, each row uses `values[numIndex]` to resolve displayed numbers
- Inputs are initialized as sequential strings, then editable by the user
- `systemName` is derived from props + data shape: `combinationSize-guarantee-finalEntries (rowCount)`

### Rendering Pattern

```
src/components/LottoXXXX.jsx → passes data, guarantee, entries
                            ↓
                  src/components/UniversalLotto.jsx
                            ↓
                    Shared rendering engine
```

### UI/Styling Conventions

- Prefer shadcn/ui primitives from `src/components/ui/*` (`button`, `card`, `badge`, `separator`)
- Use `cn()` from `src/lib/utils.js` for class composition (`clsx` + `tailwind-merge`)
- Responsive grid classes + dynamic `gridTemplateColumns` in `UniversalLotto`
- Match count badges intentionally color-coded by state

## Developer Workflows

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |

### Release Workflow

1. Build the project: `npm run build`
2. Package browser artifact: `npm run package:browser` (copies `dist/` → `release/browser/`)
3. Full release: `npm run release` (build + package)

### Build Details

- `vite.config.js` uses `vite-plugin-singlefile` and `base: './'`
- Output can be opened via static hosting or direct file usage
- Release metadata written to `release/manifest.json` with `entry: browser/index.html`
- `scripts/package-release.mjs` fails if `dist/` is missing; always build before packaging

## Adding New Lottery Systems

1. Create new `src/components/LottoXXXX.jsx` with data wrapper
2. Register it in `src/App.jsx` + sidebar navigation
3. Keep lottery-specific components data-only; put shared behavior in `UniversalLotto`
4. Preserve index-based row semantics when editing data arrays
5. System name format: `combinationSize-guarantee-finalEntries (rowCount)`

## Technology Stack

- **Framework**: React + Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: State-based page switching (no React Router)
- **Build Tool**: Vite with `vite-plugin-singlefile`

## Important Notes for Agents

- **Backend-free design**: Unless explicitly requested, assume fully static deployment
- **Index semantics**: Changing index meaning in data arrays breaks displayed mappings
- **Responsive first**: All components should work on mobile, tablet, and desktop
- **Consistent patterns**: Follow existing component structure when adding new features

## Project Structure

```
lotto-ui/
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # shadcn/ui primitives
│   │   └── *.jsx       # Feature components
│   ├── lib/            # Utilities
│   └── main.jsx        # Entry point
├── dist/               # Build output (generated)
├── release/            # Release artifacts
│   └── browser/        # Browser bundle
├── vite.config.js      # Vite configuration
└── package.json        # Project dependencies
```

## Common Tasks

### Editing Existing Lottery Data

1. Read the relevant `src/components/LottoXXXX.jsx` file
2. Understand the index-based data structure
3. Edit values while preserving row semantics
4. Test in development mode: `npm run dev`

### Adding a New Lottery Variant

1. Create `src/components/LottoXXXX.jsx` with data wrapper
2. Add route in `src/App.jsx`
3. Register in sidebar navigation (`src/components/Sidebar.jsx`)
4. Test thoroughly

### Updating UI Components

1. Use shadcn/ui primitives from `src/components/ui/*`
2. Apply consistent styling with `cn()`
3. Maintain responsive behavior
4. Test across different screen sizes

## Deployment

- Production build: `npm run build`
- Package for browser: `npm run package:browser`
- Output is self-contained HTML with embedded CSS/JS
- Can be served via any static hosting provider

## Troubleshooting

### Common Issues

1. **Build fails with "dist/ not found"**: Run `npm run build` before packaging
2. **Data mapping incorrect**: Check index semantics in data arrays
3. **Styling inconsistent**: Use `cn()` for class composition, avoid hand-rolled joins

### Debugging Tips

1. Use development mode: `npm run dev`
2. Check browser console for errors
3. Verify data structure in relevant `LottoXXXX.jsx` files
4. Ensure responsive classes are applied consistently

## License

See `LICENSE` file for details.
