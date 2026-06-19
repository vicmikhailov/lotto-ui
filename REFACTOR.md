# REFACTOR Guide — Coverlot (Lotto UI)

## Project Overview

**Coverlot** is a static React + Vite lottery system visualizer for Canadian lottery games (Lotto 6/49, Lotto Max variants). The application is fully client-side with no backend dependencies.

### Technology Stack

| Category | Technology | Current | Latest | Status |
|----------|------------|---------|--------|--------|
| Framework | React | 19.2.7 | **19.2.7** | ✅ Up to date |
| Language | TypeScript | 6.0.3 | **6.0.3** | ✅ Up to date |
| Build Tool | Vite | 8.0.16 | **8.0.16** | ✅ Up to date |
| Styling | Tailwind CSS v4 | 4.3.1 | **4.3.1** | ✅ Up to date |
| Icons | Lucide React | 1.20.0 | **1.20.0** | ✅ Up to date |
| UI Primitives | shadcn/ui | 4.11.0 | **4.11.0** | ✅ Up to date |
| State | clsx | 2.1.1 | **2.1.1** | ✅ Up to date |
| Utilities | tailwind-merge | 3.6.0 | **3.6.0** | ✅ Up to date |
| CVA | class-variance-authority | 0.7.1 | **0.7.1** | ✅ Up to date |
| Fonts | @fontsource-variable/geist | 5.2.9 | **5.2.9** | ✅ Up to date |

---

## Architecture

### Current Structure

```
src/
├── App.tsx                  # Root component with state-based routing
├── main.tsx                 # Entry point
├── components/
│   ├── Sidebar.tsx          # Desktop/tablet navigation
│   ├── BottomBar.tsx        # Mobile-only bottom navigation
│   ├── LottoGame.tsx        # Primary game renderer (~600 lines)
│   ├── SystemInputCell.tsx  # Number input component
│   ├── StickySummaryHeader.tsx  # Summary display component
│   ├── LottoIcon.tsx        # Dynamic lottery icon renderer
│   ├── About.tsx            # About page content
│   └── Lotto*.tsx           # Game-specific data wrappers (thin)
├── config/
│   └── pages.ts             # Page registry & component mapping
├── types/
│   └── index.ts             # TypeScript definitions
└── lib/
    └── utils.ts             # cn() helper for class merging
```

### Core Patterns

1. **State-based routing**: `App.tsx` manages `currentPage` state, renders components from `LOTTO_COMPONENTS` map
2. **Index-based data model**: Lottery systems use 2D arrays of indices into user-provided values
3. **Local component state**: Each game component manages its own state (`values`, `activeEntries`, `goldenBallIndex`, `isLocked`)

---

## Design Principles Alignment

### Apple HIG: Clarity, Deference, Depth

| Principle | Status | Notes |
|-----------|--------|-------|
| **Clarity** | Strong | Legible typography (Geist Variable), clear interactive states, proper contrast ratios |
| **Deference** | Partial | Some gradient backgrounds compete with content; ball styling consistent but verbose |
| **Depth** | Strong | Layered shadows, glassmorphism effects, FLIP animations for transitions |

### Material Design 3 Principles

- **Adaptive layouts**: ✅ Responsive grid systems throughout
- **Theming**: ✅ OKLCH color space with light/dark mode support
- **Motion**: ✅ Staggered entrance animations, bouncy easing curves
- **Accessibility**: ⚠️ Partial - needs aria-labels, focus management improvements

---

## Code Quality Assessment

### Strengths

1. **TypeScript Excellence** (`02-typescript-standards.instructions.md`)
   - Strict mode enabled with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
   - Centralized type definitions in `src/types/index.ts`
   - Path aliases (`@/*`) for clean imports

2. **Modern CSS Practices** (`05-styling-tailwind.instructions.md`)
   - OKLCH color space for perceptually uniform colors
   - CSS custom properties for theming
   - Tailwind v4 with `@theme inline` configuration
   - `cn()` helper from `lib/utils.ts` using `clsx` + `tailwind-merge`

3. **Component Composition** (`03-react-components.instructions.md`)
   - shadcn/ui primitives properly utilized
   - Memoization (`memo()`) where re-render costs are meaningful
   - Clear separation of data wrappers from rendering logic

4. **Responsive Design** (`05-styling-tailwind.instructions.md`)
   - Mobile-first breakpoints (`md:`, `lg:` prefixes)
   - Sidebar collapses gracefully (<768px mobile overlay, 768-1023px auto-collapse)
   - Touch-friendly targets (48px minimum)

---

## Issues & Recommendations

### P0 — Critical

#### 1. ~~Component Duplication: LottoGame vs UniversalLotto~~ ✅ **COMPLETED**

Both components implemented nearly identical functionality. `UniversalLotto.tsx` was never used by any component - all 12 lottery wrappers already used `LottoGame`.

**Action Taken**:
- Deleted `src/components/UniversalLotto.tsx` (464 lines)
- Removed unused `UniversalLottoProps` type from `types/index.ts`
- Build verified: 684KB output (reduced by ~2KB gzipped)

---

### P1 — High Priority

#### 2. Ball Styling Repetition (`05-styling-tailwind.instructions.md`)

**Problem**: Multiple inline style definitions for ball states across components:

```typescript
// LottoGame.tsx lines 12-22
const ballActive = 'size-9 sm:size-10 rounded-full font-semibold...'
const ballGold = 'size-9 sm:size-10 rounded-full font-semibold...'
const ballInactive = 'size-9 sm:size-10 rounded-full font-medium...'

// SystemInputCell.tsx lines 6-16 (similar but different values)
const ballActive = 'size-9 sm:size-10 rounded-full font-semibold...'
```

**Recommendation**: Consolidate into CSS classes in `index.css`:

```css
@layer components {
  .ball-base {
    @apply size-9 sm:size-10 rounded-full transition-all cursor-default border-0;
  }

  .ball-selected {
    @apply ball-ivory text-slate-800 hover:scale-110;
  }

  .ball-golden {
    @apply ball-gold text-amber-900 hover:scale-110;
  }

  .ball-inactive {
    @apply ball-inactive hover:scale-105;
  }
}
```

**Impact**: Single source of truth for ball styling, easier theme updates.

---

#### 3. Unused Components

| Component | Status | Recommendation |
|-----------|--------|----------------|
| `AppBar.tsx` | Not used in layout | Remove (sidebar handles navigation) |

---

### P2 — Medium Priority

#### 4. Accessibility Gaps (`10-accessibility.instructions.md`)

**Problem**: Interactive elements lack proper ARIA attributes:

```typescript
// App.tsx - game cards lack aria-labels
<Card onClick={() => setCurrentPage(page.id)}>  // No accessible name
```

**Recommendation**:

```typescript
<Card
  role="button"
  tabIndex={0}
  aria-label={`Open ${page.label} - ${page.name ?? 'lottery game'}`}
  onClick={() => setCurrentPage(page.id)}
  onKeyPress={(e) => e.key === 'Enter' && setCurrentPage(page.id)}
>
```

**Missing features**:
- Focus management on page navigation
- `role="status"` for validation messages
- Skip links for keyboard users

---

#### 5. Component Size Violation (`03-react-components.instructions.md`)

**Problem**: `LottoGame.tsx` is ~600 lines, exceeding the recommended ≤150 lines per component.

**Recommendations**:
1. Extract validation logic into a custom hook (`useValidation`)
2. Extract match calculation into a separate utility function
3. Move FLIP animations to a reusable hook (`useFlipAnimation`)
4. Extract `SummaryItem` and `LottoRow` as standalone components

```typescript
// Example: Extract validation hook
function useValidation(values: string[], maxAllowedValue: number) {
  const { duplicateIndices, outOfRangeIndices, hasErrors } = useMemo(() => {
    // ... validation logic
  }, [values, maxAllowedValue]);

  return { duplicateIndices, outOfRangeIndices, hasErrors };
}
```

---

#### 6. Mobile UX Improvements (`05-styling-tailwind.instructions.md`)

**Problem**: Missing safe-area support for modern devices:

```css
/* Add to index.css */
@layer utilities {
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

#### 7. Design Token Documentation (`05-styling-tailwind.instructions.md`)

**Problem**: No centralized documentation for design decisions.

**Recommendation**: Create `src/lib/design-tokens.ts`:

```typescript
export const ANIMATION_TIMINGS = {
  fast: '200ms',
  normal: '450ms',
  slow: '700ms',
} as const;

export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;
```

---

## File-by-File Analysis

### `src/app/App.tsx` (4295 bytes)
**Status**: ✅ Well-structured

**Strengths**:
- Clean state management for routing and theme
- Proper animation classes for card entry
- Conditional rendering pattern is clear

**Suggestions**: Add aria-labels to game cards (see P2 #4).

---

### `src/components/Sidebar.tsx` (7001 bytes)
**Status**: ⚠️ Complex but functional

**Issues**:
- Inline ball style strings (`sidebarBallActive`, `sidebarBallInactive`)
- Responsive logic scattered across multiple conditions

**Recommendations**:
1. Extract ball styles to CSS classes
2. Consolidate breakpoint logic into a single effect with clear comments

---

### `src/components/LottoGame.tsx` (~600 lines)
**Status**: ⚠️ Feature-rich but verbose

**Issues**: Exceeds 150-line component guideline; FLIP animation logic is complex.

**Recommendations**:
1. Extract validation logic into custom hook (`useValidation`)
2. Extract match calculation utility
3. Move FLIP animations to reusable hook

---

### `src/components/SystemInputCell.tsx` (4815 bytes)
**Status**: ✅ Well-implemented

**Strengths**:
- Proper double-tap detection for touch devices
- Keyboard shortcuts documented in aria-labels
- Memoized appropriately

**Suggestions**: Document why 250ms is chosen for `DOUBLE_TAP_DELAY_MS`.

---

### `src/config/pages.ts` (1897 bytes)
**Status**: ✅ Excellent pattern

**Strengths**:
- Single source of truth for page registry
- Type-safe component mapping
- Clear categorization system

---

## Performance Considerations (`09-performance.instructions.md`)

### Current State
- Build size: ~687KB (gzipped: 348KB) - reasonable for single-file deployment
- Components use `memo()` appropriately
- No unnecessary re-renders observed in critical paths

### Recommendations

1. **Add performance monitoring**:
```typescript
import { Profiler } from 'react';

<Profiler id="LottoGame" onRender={onRenderCallback}>
  <LottoGame />
</Profiler>
```

2. **Consider code splitting** if adding more games:
```typescript
const Lotto649 = lazy(() => import('./components/Lotto649'));
```

3. **Image optimization**: Logos should be SVG for crisp rendering at any size

---

## Testing Strategy (`08-testing.instructions.md`)

### Recommended Setup

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "vitest": "^2.x",
    "@testing-library/user-event": "^14.x"
  }
}
```

### Test Coverage Goals

| Component | Target Coverage | Priority |
|-----------|-----------------|----------|
| `SystemInputCell` | Input validation, toggle behavior | High |
| `LottoGame` | Match calculation, state transitions | High |
| `Sidebar` | Responsive behavior, navigation | Medium |
| `App` | Routing, theme switching | Low |

---

## Security Considerations (`11-security.instructions.md`)

### Current State
- No backend API calls (static-only deployment)
- No user data persistence beyond session
- No third-party analytics or tracking

### Recommendations
1. Add Content Security Policy (CSP) headers for production deployment
2. Sanitize any future user input if adding persistence features

---

## Migration Checklist

### Phase 1: Cleanup (Week 1)

- [x] Remove `gameStore.ts` - unused Zustand store removed
- [x] Remove `zustand` dependency from package.json
- [x] Remove `UniversalLotto.tsx` - deleted unused duplicate component
- [x] Remove `UniversalLottoProps` type definition
- [ ] Remove `AppBar.tsx` - unused component
- [ ] Move ball styles to CSS classes in `index.css`

### Phase 2: Accessibility (Week 2)

- [ ] Add aria-labels to all interactive elements
- [ ] Implement focus management for navigation
- [ ] Add skip links for keyboard users
- [ ] Test with screen reader (VoiceOver, NVDA)

### Phase 3: Refactoring (Week 3)

- [ ] Extract `useValidation` hook from LottoGame
- [ ] Extract match calculation utility function
- [ ] Create `useFlipAnimation` hook
- [ ] Reduce LottoGame.tsx to ≤150 lines

### Phase 4: Documentation & Testing (Week 4)

- [ ] Create `src/lib/design-tokens.ts` with constants
- [ ] Document component API patterns in JSDoc comments
- [ ] Set up Vitest + Testing Library
- [ ] Write unit tests for validation logic

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.1 | 2026-06-17 | Updated documentation; added @types/node dependency |
| 2.0 | 2026-06-17 | TypeScript migration complete; all .jsx → .tsx |
| 1.4 | 2026-06-15 | Dependency audit and upgrade recommendations |
| 1.3 | 2026-06-15 | Removed `UniversalLotto.tsx` duplicate component |
| 1.2 | 2026-06-15 | Aligned with project instruction guidelines; fixed duplicate sections |
| 1.1 | 2026-06-15 | Flat buttons for unselected balls; summary labels conditional |
| 1.0 | 2026-06-15 | Initial comprehensive refactor guide |

### Completed Actions

- ✅ TypeScript migration complete (all `.jsx` → `.tsx`)
- ✅ Removed `ErrorBoundary` component (non-functional)
- ✅ Removed placeholder buttons from `BottomBar`
- ✅ Fixed `CardLabel` contrast ratio for WCAG compliance
- ✅ Implemented realistic ivory pool ball styling
- ✅ Created "empty socket" effect for inactive balls
- ✅ Removed unused `gameStore.ts` and `zustand` dependency
- ✅ Changed unselected ball style to flat button with minimal shadow
- ✅ Summary labels: flat button when count=0, ivory ball when count>0
- ✅ Deleted `UniversalLotto.tsx` and `UniversalLottoProps` type (unused duplicate)
- ✅ Added `@types/node` for vite.config.ts TypeScript support

---

## Dependency Status

All dependencies are currently up to date as of June 2026:

| Package | Version | Status |
|---------|---------|--------|
| **react** | 19.2.7 | ✅ Latest |
| **react-dom** | 19.2.6 | ✅ Latest |
| **typescript** | 6.0.3 | ✅ Latest |
| **vite** | 8.0.16 | ✅ Latest |
| **tailwindcss** | 4.3.1 | ✅ Latest |
| **lucide-react** | 1.20.0 | ✅ Latest |
| **shadcn** | 4.11.0 | ✅ Latest |

### Maintenance Notes

- All dependencies are stable and production-ready
- No breaking changes pending in current versions
- Regular `npm audit` shows no critical vulnerabilities

---

## References

### Project Instructions

- `.claude/.github/instructions/01-project-structure.instructions.md`
- `.claude/.github/instructions/03-react-components.instructions.md`
- `.claude/.github/instructions/05-styling-tailwind.instructions.md`
- `.claude/.github/instructions/10-accessibility.instructions.md`
- `.claude/.github/instructions/15-code-quality.instructions.md`

### External Guidelines

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## Contact & Maintenance

**Primary Maintainer**: Victor Mikhailov  
**Repository**: https://github.com/victor-mikhailov/lotto-ui  
**Last Updated**: 2026-06-17
