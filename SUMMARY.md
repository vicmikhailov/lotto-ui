# Lotto System Visualization - Project Summary

This document provides a comprehensive overview of the `lotto-ui` application, detailing its architecture, data model, UI patterns, and release workflow. This is a static React-based lottery combination visualizer with no backend dependencies.

---

## 1. Project Overview

**Project Name**: Coverlot  
**Framework Stack**: React 19 + Vite 8 + Tailwind CSS 4.3  
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
| UI runtime | React 19 (no hooks rules violations) |
| Build tool | Vite 8 with `vite-plugin-singlefile` |
| Styling | Tailwind CSS 4 (newer `@import "tailwindcss"`) |
| Component primitives | shadcn/ui (Radix UI + class-variance-authority) |

### 2.2 Navigation Pattern
The app uses **state-based page routing** (not React Router):
- `App.jsx` maintains `currentPage` state
- A local `pages` array maps page IDs to labels and icons
- Navigation updates `currentPage`, triggering conditional rendering in the main route
- Sidebar (`Sidebar.jsx`) owns navigation UX and responsive behavior

### 2.3 Responsive Behavior
- **Mobile (<768px)**: Sidebar slides in/out with overlay backdrop; always collapsed initially
- **Tablet (768–1023px)**: Sidebar auto-collapses; can be manually toggled
- **Desktop (≥1024px)**: Sidebar defaults to expanded; toggle button available

---

## 3. Data Model and Rendering Pattern

### 3.1 Index-Based Row Semantics
Each lottery variant file (`src/components/Lotto*.jsx`) defines a **2D array of indices**, not final numbers. For example:
```javascript
// Lotto6410.jsx
const data = [
  [0, 1, 5, 7, 8, 9], // Row uses inputs at indices 0,1,5,7,8,9
  [0, 2, 5, 6, 7, 9],
  // ...
]
```

### 3.2 `UniversalLotto.jsx` Engine
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
```javascript
const combinationSize = data[0]?.length || 0;
const maxIndex = Math.max(...data.flat());
const finalEntries = entries || (maxIndex + 1);
const systemName = `${combinationSize}-${guarantee}-${finalEntries} (${data.length})`;
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
- **`cn()` from `src/lib/utils.js`**: Composes classes via `clsx()` + `tailwind-merge()`
  - Avoids manual string joins and duplicate class issues
  - Standard across all components

### 4.3 Responsive Design
- **UniversalLotto grid**: Dynamic column count based on `combinationSize`
  - ≤6 columns: up to 3 per row (`md:grid-cols-2 xl:grid-cols-3`)
  - >6 columns: up to 2 per row (`lg:grid-cols-2`)
- **Sidebar**: Collapsible with width transitions (`w-64` ↔ `w-16`)

---

## 5. Lottery Variant Files

All variant files follow this minimal pattern:
```javascript
import UniversalLotto from './UniversalLotto'

export default function LottoXXXX() {
  const data = [
    [0, 1, 2, ...],
    // rows of indices
  ]
  return <UniversalLotto data={data} guarantee={N} entries={M} />
}
```

| File | combinationSize | guarantee | entries | rows |
| --- | --- | --- | --- | --- |
| `Lotto649.jsx` | 6 | 4 | 9 | 12 |
| `Lotto658.jsx` | 6 | 5 | 8 | 12 |
| `Lotto6410.jsx` | 6 | 4 | 10 | 20 |
| `Lotto758.jsx` | 7 | 5 | 8 | 6 |
| `Lotto759.jsx` | 7 | 5 | 9 | 9 |
| `Lotto7510.jsx` | 7 | 5 | 10 | 21 |
| `Lotto7511.jsx` | 7 | 5 | 11 | 36 |

---

## 6. Build & Release Workflow

### 6.1 Development Commands
| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production assets to `dist/` |
| `npm run lint` | Run ESLint on the project |

### 6.2 Production Build Details
- **Single File Output**: `vite-plugin-singlefile` inlines all JS/CSS into one HTML file
- **Base Path**: `base: './'` in `vite.config.js` allows direct file opening
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

### 7.1 `LottoIcon.jsx`
A dynamic SVG icon generator for sidebar navigation items:
- Parses label strings like `"7-5-8 (6)"` to extract `n1`, `n2`, `n3`
- Renders stacked rotated numbers in a circular badge
- States: secondary (default), primary (hover/focus)
- Included for aesthetic consistency in navigation

### 7.2 `About.jsx`
Static informational page explaining the app's purpose and mathematical context of lottery systems.

---

## 8. Developer Workflows

### Adding a New Lottery System
1. **Create new data wrapper** (`src/components/LottoXXXX.jsx`) with index array and props
2. **Register in `App.jsx`**:
   - Add to `pages` array with unique ID
   - Import component and add conditional route in render
3. **Register in `Sidebar.jsx`**:
   - Add to `navItems` array with matching ID

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

---

## 10. Future Considerations

- **Config-driven system registry**: Replace manual `pages`/`navItems` arrays with a single source of truth
- **Index validation**: Add runtime checks for index ranges in `UniversalLotto`
- **CSV export**: Allow users to download ticket rows as a file
- **Number permutation generation**: Add helper tools for generating guaranteed coverings

---
*Last updated based on `vite-plugin-singlefile` 2.1.0 and Tailwind CSS v4.3.*# Lotto System Visualization - Summary Report & Improvement Plan

This document analyzes the existing `lotto-ui` application, focusing on its current structure, implementation patterns, maintenance considerations, and areas for improvement. The project demonstrates a functional core but exhibits opportunities to enhance scalability, maintainability, and developer experience through architectural refactoring and adoption of modern best practices.

---
## 1. Project Overview

**Project Name**: Lotto UI
**Framework Stack**: React 19 + Vite 8 + Tailwind CSS 4.3
**Purpose**: Interactive visualization platform for lottery combination systems, allowing users to input numbers and visualize winning combinations with status indicators

### Current Architecture
- **Page Routing**: Manual routing using `currentPage` state in App.jsx (simulated navigation)
- **Component Pattern**: Multiple duplicated entry-point components for each lottery system
- **State Management**: Local component state only (useState hooks)
- **UI Library**: Custom components built with Radix UI primitives and Tailwind CSS

---

## 2. Critical Architecture Issues

### 2.1 Component Duplication (DRY Violation)
The project contains multiple entry-point components with identical patterns:
- `Lotto649.jsx`, `Lotto658.jsx`, `Lotto758.jsx`, etc.
- All follow the same structure: import → data definition → render `<UniversalLotto />`

**Impact**: 
- High maintenance burden (each new system requires a new file)
- Inconsistent data management
- Duplicate code across ~7+ similar components

### 2.2 Missing Router Implementation
**Current**: State-based navigation in App.jsx
