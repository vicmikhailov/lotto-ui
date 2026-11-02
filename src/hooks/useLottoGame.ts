import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { LottoGameState } from '@/types'

// Default values generator for lotto entries
const getDefaultValues = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => (i + 1).toString())

/**
 * Custom hook for managing lotto game state
 *
 * @param totalEntries - Total number of entries available in the game
 * @param persistedState - Optional state to restore from previous session
 * @param onStateChange - Callback when user-relevant state changes
 *
 * @returns Game state and handlers for interacting with the lotto game
 */
export function useLottoGame({
  totalEntries,
  persistedState,
  onStateChange,
}: {
  totalEntries: number
  persistedState?: LottoGameState | null
  onStateChange?: (state: Omit<LottoGameState, 'showValidationMessage' | 'columnCount' | 'isTransitioning'>) => void
}) {
  const [values, setValues] = useState<string[]>(() =>
    persistedState?.values ?? getDefaultValues(totalEntries)
  )
  const [activeEntries, setActiveEntries] = useState<boolean[]>(() =>
    persistedState?.activeEntries ?? Array.from({ length: totalEntries }, () => false)
  )
  const [goldenBallIndex, setGoldenBallIndex] = useState<number | null>(() =>
    persistedState?.goldenBallIndex ?? null
  )
  const [isLocked, setIsLocked] = useState<boolean>(() =>
    persistedState?.isLocked ?? true
  )
  // Transient UI states - not persisted
  const [showValidationMessage, setShowValidationMessage] = useState<boolean>(false)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)

  // Refs to track previous state for reset logic
  const prevEntriesRef = useRef(totalEntries)
  const animTimeoutRef = useRef<number | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current)
    }
  }, [])

  // Report state changes to parent for persistence (only user-relevant state)
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        values,
        activeEntries,
        goldenBallIndex,
        isLocked,
      })
    }
  }, [values, activeEntries, goldenBallIndex, isLocked, onStateChange])

  // Keep prevEntriesRef in sync with totalEntries
  useEffect(() => {
    if (totalEntries !== prevEntriesRef.current) {
      prevEntriesRef.current = totalEntries
    }
  }, [totalEntries])

  const handleInputChange = useCallback((index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '')
    const normalizedValue = sanitizedValue === '' ? '' : String(Number(sanitizedValue))

    setShowValidationMessage(false)

    setValues((currentValues) => {
      const nextValues = [...currentValues]
      nextValues[index] = normalizedValue
      return nextValues
    })

    setActiveEntries((currentActiveEntries) => {
      const nextActiveEntries = [...currentActiveEntries]
      nextActiveEntries[index] = false
      return nextActiveEntries
    })
  }, [])

  const handleToggle = useCallback((index: number) => {
    if (!isLocked) return

    setActiveEntries((currentActiveEntries) => {
      const nextActiveEntries = [...currentActiveEntries]
      const nextActive = !nextActiveEntries[index]
      nextActiveEntries[index] = nextActive

      if (nextActive) {
        setAnimatingIndex(index)
        const animTimeoutId = window.setTimeout(() => setAnimatingIndex(null), 300)
        if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current)
        animTimeoutRef.current = animTimeoutId
      } else {
        setGoldenBallIndex((currentGolden) =>
          currentGolden === index ? null : currentGolden
        )
      }
      return nextActiveEntries
    })
  }, [isLocked])

  const handleDoubleToggle = useCallback((index: number, wasGolden: boolean) => {
    if (!isLocked) return

    setActiveEntries((currentActiveEntries) => {
      const nextActiveEntries = [...currentActiveEntries]
      nextActiveEntries[index] = true
      return nextActiveEntries
    })
    setGoldenBallIndex(wasGolden ? null : index)
  }, [isLocked])

  const handleSet = useCallback(() => {
    setValues((currentValues) => [...currentValues].sort((a, b) => Number(a) - Number(b)))
    setIsLocked(true)
    setShowValidationMessage(false)
  }, [])

  const handleEdit = useCallback(() => {
    setShowValidationMessage(false)
    setActiveEntries(Array.from({ length: totalEntries }, () => false))
    setGoldenBallIndex(null)
    setIsLocked(false)
  }, [totalEntries])

  const handleRandom = useCallback(() => {
    const pool = Array.from({ length: 52 }, (_, i) => i + 1)
    const result: number[] = []
    for (let i = 0; i < totalEntries && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length)
      const value = pool[randomIndex]
      if (value !== undefined) {
        result.push(value)
      }
      pool.splice(randomIndex, 1)
    }
    result.sort((a, b) => a - b)
    setValues(result.map(String))
    setShowValidationMessage(false)
    setActiveEntries(Array.from({ length: totalEntries }, () => false))
    setGoldenBallIndex(null)
  }, [totalEntries])

  const handleReset = useCallback(() => {
    setShowValidationMessage(false)
    setValues(Array.from({ length: totalEntries }, () => ''))
    setActiveEntries(Array.from({ length: totalEntries }, () => false))
    setGoldenBallIndex(null)
    setIsLocked(false)
  }, [totalEntries])

  // Check validation
  const { duplicateIndices, outOfRangeIndices, hasValidationErrors } = useMemo(() => {
    const valueToIndices: Record<string, number> = {}
    const dupIndices = new Set<number>()
    const rangeIndices = new Set<number>()

    values.forEach((value, index) => {
      if (value !== '') {
        const existingIndex = valueToIndices[value]
        if (existingIndex !== undefined) {
          dupIndices.add(existingIndex)
          dupIndices.add(index)
        } else {
          valueToIndices[value] = index
        }

        const numericValue = Number(value)
        if (Number.isNaN(numericValue) || numericValue < 1 || numericValue > 52) {
          rangeIndices.add(index)
        }
      }
    })

    return {
      duplicateIndices: dupIndices,
      outOfRangeIndices: rangeIndices,
      hasValidationErrors: dupIndices.size > 0 || rangeIndices.size > 0
    }
  }, [values])

  const selectedCount = useMemo(() => activeEntries.filter((entry) => entry).length, [activeEntries])

  return {
    // State
    values,
    activeEntries,
    goldenBallIndex,
    isLocked,
    showValidationMessage,
    animatingIndex,
    hasValidationErrors,
    duplicateIndices,
    outOfRangeIndices,
    selectedCount,

    // Handlers
    handleInputChange,
    handleToggle,
    handleDoubleToggle,
    handleSet,
    handleEdit,
    handleRandom,
    handleReset,

    // Refs for external use
    animTimeoutRef,
  }
}
