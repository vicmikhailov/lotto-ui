// Type definitions for lotto-ui

/**
 * Lotto row data - represents a single combination row
 */
export interface LottoRowData {
  /**
   * Array of numbers in this row (indices into the main values array)
   */
  row: number[]
  /**
   * Index of this row in the data list
   */
  rowIndex: number
}

/**
 * Config for a specific lotto variant
 */
export interface LottoConfig {
  /**
   * Combination size (e.g., 6 for Pick-6, 7 for Pick-7)
   */
  combinationSize: number
  /**
   * Number of selection options (e.g., 4, 5)
   */
  guarantee: number
  /**
   * Total entries available (e.g., 9, 10, 12)
   */
  entries: number
  /**
   * Data array containing all possible combinations
   */
  data: number[][]
}

/**
 * Game category types for visual differentiation
 */
export type GameCategory = '64x' | '65x' | '75x' | 'info'

/**
 * Page configuration for navigation
 */
export interface PageConfig {
  /**
   * Unique identifier for the page (used in routing)
   */
  id: string
  /**
   * Short display label for cards and nav
   */
  label: string
  /**
   * Full panel name displayed on game pages
   */
  name?: string
  /**
   * Icon component to display
   */
  icon: React.ComponentType<{ className?: string }>
  /**
   * Game category for visual styling (6-number/4-option, etc.)
   */
  category?: GameCategory
}

/**
 * Props for LottoIcon component
 */
export interface LottoIconProps {
  /**
   * Label to parse, format: "6-4-9 (12)"
   */
  label: string
  /**
   * Additional CSS classes to apply
   */
  className?: string
}

/**
 * Props for SystemInputCell component
 */
export interface SystemInputCellProps {
  /**
   * Index of this cell in the grid
   */
  index: number
  /**
   * Current value displayed
   */
  value: string
  /**
   * Whether this cell is in button mode (vs input mode)
   */
  isButtonMode: boolean
  /**
   * Whether this entry is selected/active
   */
  isActive: boolean
  /**
   * Whether this entry is the golden ball (bonus)
   */
  isGolden: boolean
  /**
   * Whether this cell has a validation error
   */
  hasError: boolean
  /**
   * Callback when value changes (index, value)
   */
  onValueChange: (index: number, value: string) => void
  /**
   * Callback when pasting data (index, clipboard event)
   */
  onPaste?: (index: number, event: React.ClipboardEvent<HTMLInputElement>) => void
  /**
   * Callback for single click/toggle
   */
  onToggle: (index: number) => void
  /**
   * Callback for double-click to set golden ball
   */
  onDoubleToggle: (index: number, wasGolden: boolean) => void
}

/**
 * Props for LottoRow component
 */
export interface LottoRowProps {
  /**
   * The combination row data (indices)
   */
  row: number[]
  /**
   * Index of this row in the data
   */
  rowIndex: number
  /**
   * Current values array (all user inputs)
   */
  values: string[]
  /**
   * Array of active states for each entry
   */
  activeEntries: boolean[]
  /**
   * Index of the currently selected golden ball, or null
   */
  goldenBallIndex?: number | null
  /**
   * Number of matches for this row
   */
  count: number
}

/**
 * Props for SummaryItem component
 */
export interface SummaryItemProps {
  /**
   * Label to display (e.g., "3", "4", "5")
   */
  countLabel: string
  /**
   * Numeric value to display
   */
  countValue: number
}

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /**
   * Child components to wrap with error boundary
   */
  children: React.ReactNode
}

/**
 * State of a Lotto game that needs to be persisted across navigation
 */
export interface LottoGameState {
  values: string[]
  activeEntries: boolean[]
  goldenBallIndex: number | null
  isLocked: boolean
  // Transient UI states - not actually persisted, only used for internal communication
  showValidationMessage?: boolean
  columnCount?: number
  isTransitioning?: boolean
}
