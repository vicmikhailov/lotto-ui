# Lotto System Visualization - Project Summary

This document provides a comprehensive overview of the `lotto-ui` application (Coverlot), detailing its architecture, data model, UI patterns, and release workflow. This is a static React-based TypeScript lottery combination visualizer with no backend dependencies.

---

## 1. Project Overview

**Project Name**: Coverlot  
**Framework Stack**: React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4  
**Purpose**: Interactive visualization platform for lottery combination systems, allowing users to input custom numbers and visualize match counts against precomputed ticket combinations

### Core Functionality
- Users edit numbered input fields (e.g., "1" through "N")
- Each lottery system is defined as a 2D array of **indices** referencing those inputs
- Every ticket row displays which user-entered values appear in it
- A match count badge shows how many inputs match (color-coded: yellow=full, blue=guarantee, red>guarantee)
- System name format: `{combinationSize}-{guarantee}-{finalEntries} ({rowCount})`

---

## 2. Architecture Overview

### 2.1 Application Structure
| Layer | Choice |
| --- | --- |
| UI runtime | React 19 (TypeScript) |
| Build tool | Vite 8 with `vite-plugin-singlefile` |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Component primitives | shadcn/ui (Radix UI + class-variance-authority) |

### 2.2 Navigation Pattern
The app uses **state-based page routing** (not React Router):
- `App.tsx` maintains `currentPage` state
- A local `PAGES` array in `src/config/pages.ts` maps page IDs to labels and icons
- Navigation updates `currentPage`, triggering conditional rendering in the main route
- Sidebar (`Sidebar.tsx`) owns navigation UX and responsive behavior

### 2.3 Responsive Behavior
- **Mobile (<768px)**: Sidebar slides in/out with overlay backdrop; always collapsed initially
- **Tablet (768–1023px)**: Sidebar auto-collapses; can be manually toggled
- **Desktop (≥1024px)**: Sidebar defaults to expanded; toggle button available

---

## 3. Data Model and Rendering Pattern

### 3.1 Index-Based Row Semantics
Each lottery variant file (`src/components/Lotto*.tsx`) defines a **2D array of indices**, not final numbers. For example:
```typescript
// Lotto6410.tsx
const DATA = [
  [0, 1, 5, 7, 8, 9], // Row uses inputs at indices 0,1,5,7,8,9
  [0, 2, 5, 6, 7, 9],
  // ...
]
```

### 3.2 `LottoGame.tsx` Engine
This shared component handles all rendering logic:
- **State**: Maintains `values[]` array initialized as sequential strings (`"1".."N"`)
- **Dynamic Inputs**: Renders input fields with user-modifiable values
- **Row Rendering**: Maps each row using `values[numIndex]` to resolve displayed content
- **Match Counting**: Filters each row's indices, checking which `values[idx]` are non-empty
- **Badge Styling**: Color-codes match counts based on state:
  - Yellow: full combination match (`count === combinationSize`)
  - Blue: exact guarantee (`count === guarantee`)
  - Red: exceeds guarantee (`count > guarantee`)

### 3.3 Key Derived Values
```typescript
const combinationSize = DATA[0]?.length || 0;
const maxIndex = Math.max(...DATA.flat());
const finalEntries = entries || (maxIndex + 1);
const systemName = `${combinationSize}-${guarantee}-${finalEntries} (${DATA.length})`;
```

---

## 4. UI/Styling Conventions

### 4.1 Component Primitives
The app uses shadcn/ui primitives from `src/components/ui/`:
- **Button**: Uses `cva()` variants for `default`, `outline`, `secondary`, `ghost`, etc.
- **Card**: Structure with `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- **Badge**: Color variants (`default`, `secondary`, `destructive`) via `cva()`
- **Separator**: Radix UI primitive wrapped with Tailwind utility class composition

### 4.2 Utility Functions
- **`cn()` from `src/lib/utils.ts`**: Composes classes via `clsx()` + `tailwind-merge()`
  - Avoids manual string joins and duplicate class issues
  - Standard across all components

### 4.3 Responsive Design
- **LottoGame grid**: Dynamic column count based on `combinationSize`
  - ≤6 columns: up to 3 per row (`md:grid-cols-2 xl:grid-cols-3`)
  - >6 columns: up to 2 per row (`lg:grid-cols-2`)
- **Sidebar**: Collapsible with width transitions (`w-64` ↔ `w-16`)

---

## 5. Lottery Variant Files

All variant files follow this minimal pattern:
```typescript
import LottoGame from './LottoGame'

export default function LottoXXXX() {
  const DATA = [
    [0, 1, 2, ...],
    // rows of indices
  ]
  return <LottoGame data={DATA} guarantee={N} entries={M} />
}
```

| File | combinationSize | guarantee | entries | rows |
| --- | --- | --- | --- | --- |
| `Lotto649.tsx` | 6 | 4 | 9 | 12 |
| `Lotto658.tsx` | 6 | 5 | 8 | 12 |
| `Lotto6410.tsx` | 6 | 4 | 10 | 20 |
| `Lotto6411.tsx` | 6 | 4 | 11 | 33 |
| `Lotto6412.tsx` | 6 | 4 | 12 | 48 |
| `Lotto659.tsx` | 6 | 5 | 9 | 30 |
| `Lotto6510.tsx` | 6 | 5 | 10 | 50 |
| `Lotto758.tsx` | 7 | 5 | 8 | 6 |
| `Lotto759.tsx` | 7 | 5 | 9 | 9 |
| `Lotto7510.tsx` | 7 | 5 | 10 | 21 |
| `Lotto7511.tsx` | 7 | 5 | 11 | 36 |

---

## 6. Build & Release Workflow

### 6.1 Development Commands
| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production assets to `dist/` |
| `npm run lint` | Run ESLint on the project |
| `npm run type-check` | Run TypeScript check |

### 6.2 Production Build Details
- **Single File Output**: `vite-plugin-singlefile` inlines all JS/CSS into one HTML file
- **Base Path**: `base: './'` in `vite.config.ts` allows direct file opening
- **Minification**: Terser with console/debugger removal

### 6.3 Release Packaging
The script `scripts/package-release.mjs` performs:
1. Verifies `dist/` exists (fails if build was skipped)
2. Removes and recreates `release/browser/`
3. Copies all dist assets to `release/browser/`
4. Writes `release/manifest.json`:
   ```json
   {
     "type": "static-browser-app",
     "entry": "browser/index.html",
     "notes": "Serve the browser directory from any static host..."
   }
   ```

### 6.4 Full Release Flow
```bash
npm run release    # npm run build && npm run package:browser
```

The resulting `release/browser/index.html` can be:
- Opened directly in a browser (even via `file://` protocol)
- Deployed to any static host (GitHub Pages, Netlify Drop, etc.)

---

## 7. Add-on Components

### 7.1 `LottoIcon.tsx`
A dynamic SVG icon generator for sidebar navigation items:
- Parses label strings like `"6-4-9 (12)"` to extract `n1`, `n2`, `n3`
- Renders stacked rotated numbers in a circular badge
- States: secondary (default), primary (hover/focus)
- Included for aesthetic consistency in navigation

### 7.2 `About.tsx`
Static informational page explaining the app's purpose and mathematical context of lottery systems.

### 7.3 `BottomBar.tsx`
Mobile-only bottom navigation bar (`md:hidden`) for quick access to home on small screens.

---

## 8. Developer Workflows

### Adding a New Lottery System
1. **Create new data wrapper** (`src/components/LottoXXXX.tsx`) with index array and props
2. **Register in `src/config/pages.ts`**:
   - Add to `PAGES` array with unique ID, label, and category
   - Import component and add to `LOTTO_COMPONENTS` map
3. **Sidebar automatically updates** via `SIDEBAR_ITEMS` which spreads `PAGES`

### Editing Data Arrays
- Preserve **index semantics**: changing index meaning breaks displayed mappings
- Ensure indices are contiguous from `0` to `entries - 1`
- Avoid changing row lengths (guarantees depend on fixed combination size)

---

## 9. Constraints & Design Principles

| Constraint | Rationale |
| --- | --- |
| No backend/API calls | Fully static deployment; zero runtime infrastructure required |
| No database | All data is client-side code or user input |
| No React Router | Simplifies deployment (single file) and reduces dependencies |
| TypeScript only | Type safety and better IDE support for all code |

---

## 10. Future Considerations

- **Ball styling consolidation**: Move inline ball styles to CSS classes in `index.css`
- **Component extraction**: Break down LottoGame.tsx into smaller hooks/components
- **Accessibility improvements**: Add ARIA labels, focus management, skip links
- **Design tokens**: Create `src/lib/design-tokens.ts` for animation timings, easing curves, breakpoints

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-06-17 | TypeScript migration complete; documentation updated |
| 1.4 | 2026-06-15 | Dependency audit and upgrade recommendations |
| 1.3 | 2026-06-15 | Removed `UniversalLotto.tsx` duplicate component |
| 1.0 | 2026-06-04 | Initial comprehensive refactor guide |

---

*Last updated: 2026-06-17*
