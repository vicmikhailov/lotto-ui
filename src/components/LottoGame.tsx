import React, { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardLabel } from '@/components/ui/card-label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { LottoRowProps, LottoGameState } from '@/types'
import SystemInputCell from './SystemInputCell'
import lottoMaxLogo from '@/assets/lotto-max-logo.png'
import lotto649Logo from '@/assets/lotto-649-logo.png'

const ballActive =
  'size-9 sm:size-10 rounded-full font-semibold transition-all cursor-default border-0 ' +
  'ball-ivory text-slate-800 hover:scale-110 '

const ballGold =
  'size-9 sm:size-10 rounded-full font-semibold transition-all cursor-default border-0 ' +
  'ball-gold text-amber-900 hover:scale-110 '

const ballInactive =
  'size-9 sm:size-10 rounded-full font-medium transition-all cursor-default border-0 ' +
  'ball-inactive hover:scale-105 '

interface BadgeTiers {
  [key: number]: string
}

const BADGE_TIERS: BadgeTiers = {
  3: 'bg-stone-300 text-stone-950 hover:bg-stone-300 border-transparent',
  4: 'bg-lime-100 text-lime-950 hover:bg-lime-100 border-transparent',
  5: 'bg-violet-400 text-white hover:bg-violet-400 border-transparent shadow-sm shadow-violet-400/30',
  6: 'bg-sky-700 text-white hover:bg-sky-700 border-transparent ring-1 ring-sky-400/50 shadow-sm shadow-sky-700/30',
  7: 'bg-stone-800 text-lime-200 hover:bg-stone-800 border-transparent ring-1 ring-lime-400/50 shadow-sm shadow-stone-800/30',
}

const getDefaultValues = (totalEntries: number): string[] =>
  Array.from({ length: totalEntries }, (_, i) => (i + 1).toString())

const getCountBadgeClass = (count: number): string => {
  if (count < 3) return 'bg-gray-100 text-gray-600'
  return BADGE_TIERS[count] ?? ''
}

interface LottoRowInternalProps extends LottoRowProps {
  combinationSize: number
  animatingIndex: number | null
  columnIndex: number
  isTransitioning: boolean
  columnCount: number
}

const areLottoRowPropsEqual = (prevProps: LottoRowInternalProps, nextProps: LottoRowInternalProps): boolean => {
  if (prevProps.count !== nextProps.count) return false
  if (prevProps.rowIndex !== nextProps.rowIndex) return false
  if (prevProps.combinationSize !== nextProps.combinationSize) return false
  if (prevProps.row !== nextProps.row) return false
  if (prevProps.animatingIndex !== nextProps.animatingIndex) return false
  if (prevProps.goldenBallIndex !== nextProps.goldenBallIndex) return false
  if (prevProps.columnIndex !== nextProps.columnIndex) return false
  if (prevProps.isTransitioning !== nextProps.isTransitioning) return false
  if (prevProps.columnCount !== nextProps.columnCount) return false

  const { row, values: prevValues, activeEntries: prevActive } = prevProps
  const { values: nextValues, activeEntries: nextActive } = nextProps

  for (let i = 0; i < row.length; i++) {
    const idx = row[i]
    if (prevValues[idx as number] !== nextValues?.[idx as number]) return false
    if (prevActive[idx as number] !== nextActive[idx as number]) return false
  }

  return true
}

const LottoRow = memo(({ row, rowIndex, values, activeEntries, goldenBallIndex, count, animatingIndex, columnIndex, isTransitioning, columnCount }: LottoRowInternalProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const firstPositionRef = React.useRef<{ x: number; y: number; width: number } | null>(null)

  // Capture initial position when transition starts
  React.useEffect(() => {
    if (isTransitioning && cardRef.current && !firstPositionRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      firstPositionRef.current = {
        x: rect.left,
        y: rect.top,
        width: rect.width
      }
    }
  }, [isTransitioning])

  // Apply FLIP animation when column count changes
  React.useEffect(() => {
    if (!isTransitioning || !cardRef.current || !firstPositionRef.current) return

    const element = cardRef.current
    const first = firstPositionRef.current
    const last = element.getBoundingClientRect()

    const deltaX = first.x - last.x
    const deltaY = first.y - last.y
    const deltaScale = first.width / last.width

    // Apply inverse transform to show old position
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaScale})`
    element.style.opacity = '0.7'

    // Animate to final position with stagger based on column index
    requestAnimationFrame(() => {
      const staggerDelay = columnIndex * 80
      setTimeout(() => {
        element.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease-out'
        element.style.transform = ''
        element.style.opacity = '1'

        // Clean up styles after animation
        setTimeout(() => {
          element.style.transition = ''
          element.style.transform = ''
          firstPositionRef.current = null
        }, 500)
      }, staggerDelay)
    })
  }, [columnCount, columnIndex, isTransitioning])

  return (
    <div ref={cardRef} className="border-border/50 shadow-sm relative min-w-0 w-full max-w-100">
      <Card className="border-transparent shadow-none">
        <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/50 font-medium">
          {rowIndex + 1}
        </div>
      <CardContent className="flex items-center gap-2 py-3 px-2 sm:px-4 pr-2 sm:pr-4 flex-nowrap">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1 shrink-0 pl-1">
            {row.map((numIndex, itemIndex) => {
              const hasValue = values[numIndex] !== ''
              const isSelected = hasValue && activeEntries[numIndex]
              const isGolden = numIndex === goldenBallIndex
              const isAnimating = animatingIndex === numIndex

              return (
                <div
                  key={itemIndex}
                  className={cn(
                    'flex items-center justify-center text-xs sm:text-sm font-semibold shadow-sm shrink-0',
                    isGolden ? ballGold : isSelected ? ballActive : ballInactive,
                    isAnimating && 'ball-select-animate'
                  )}
                >
                  {values[numIndex] || ''}
                </div>
              )
            })}
          </div>
        </div>
        <div className="h-10 flex items-center ml-auto shrink-0">
          <Badge
            variant="secondary"
            className={cn(
              "size-8 sm:size-9 rounded-md flex items-center justify-center text-xs font-bold p-0 shadow-sm",
              getCountBadgeClass(count)
            )}
          >
            {count}
          </Badge>
        </div>
      </CardContent>
      </Card>
    </div>
  )
}, areLottoRowPropsEqual)

const SummaryItem = memo(({ countLabel, countValue }: { countLabel: string; countValue: number }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-white px-1 py-1 shadow-sm shrink-0 dark:bg-card">
      {/* Label - ball when count > 0, flat button when count = 0 */}
      <div className={cn(
        'inline-flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-sm font-bold leading-none border-0 cursor-default shrink-0',
        countValue === 0
          ? 'bg-muted text-muted-foreground'
          : 'ball-ivory text-slate-800'
      )}>
        {countLabel}
      </div>
      {/* Count value - stays as plain number */}
      <span className="inline-flex h-7 min-w-10 items-center justify-center rounded-md px-2 text-sm font-bold leading-none shrink-0">
        {countValue}
      </span>
    </div>
  )
})

interface LottoGameProps {
  data: number[][]
  guarantee: number
  entries?: number
  panelName?: string
  persistedState?: LottoGameState | undefined
  onStateChange?: ((state: LottoGameState) => void) | undefined
}

export default function LottoGame({ data, guarantee, entries, panelName, persistedState, onStateChange }: LottoGameProps) {
  const combinationSize = data[0]?.length ?? 0

  // Debug: Log when component mounts and what persistedState it receives
  console.log('[LottoGame] Mount/Update:', {
    panelName,
    hasPersistedState: !!persistedState,
    persistedValues: persistedState?.values,
    persistedActive: persistedState?.activeEntries,
    persistedLocked: persistedState?.isLocked
  })

  const maxIndex = useMemo(() => {
    let max = -1
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      if (!row) continue
      for (let j = 0; j < row.length; j++) {
        const val = row[j]
        if (val !== undefined && val > max) max = val
      }
    }
    return max ?? -1
  }, [data])

  const calculatedEntries = (maxIndex as number) + 1 || 0
  const finalEntries = entries ?? calculatedEntries

  // Initialize state from persistedState if available, otherwise use defaults
  // Only persist user-relevant state (values, activeEntries, goldenBallIndex, isLocked)
  const [values, setValues] = useState<string[]>(() =>
    persistedState?.values ?? getDefaultValues(finalEntries)
  )
  const [activeEntries, setActiveEntries] = useState<boolean[]>(() =>
    persistedState?.activeEntries ?? Array.from({ length: finalEntries }, () => false)
  )
  const [goldenBallIndex, setGoldenBallIndex] = useState<number | null>(() =>
    persistedState?.goldenBallIndex ?? null
  )
  const [isLocked, setIsLocked] = useState<boolean>(() =>
    persistedState?.isLocked ?? true
  )
  // Transient UI states - always reset on mount
  const [showValidationMessage, setShowValidationMessage] = useState<boolean>(false)
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null)
  const [columnCount, setColumnCount] = useState<number>(2)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  const prevEntriesRef = React.useRef(finalEntries)
  const resultsContainerRef = React.useRef<HTMLDivElement>(null)
  // Refs to avoid closure staleness in ResizeObserver callback
  const columnCountRef = React.useRef(columnCount)
  const isTransitioningRef = React.useRef(isTransitioning)
  const animationFrameRef = React.useRef<number | null>(null)
  const transitionTimeoutRef = React.useRef<number | null>(null)
  const animTimeoutRef = React.useRef<number | null>(null)

  // Keep refs in sync with state using useEffect
  React.useEffect(() => {
    columnCountRef.current = columnCount
    isTransitioningRef.current = isTransitioning
  }, [columnCount, isTransitioning])

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

  // Only reset state when the game component itself changes (not on navigation back)
  // The persistedState prop handles preserving user selections across navigation
  React.useEffect(() => {
    const hasPersistedState = persistedState !== undefined && persistedState !== null
    if (!hasPersistedState && finalEntries !== prevEntriesRef.current) {
      // Only reset if there's no persisted state and entries changed
      setValues(getDefaultValues(finalEntries))
      setActiveEntries(Array.from({ length: finalEntries }, () => false))
      setGoldenBallIndex(null)
      setIsLocked(true)
      setShowValidationMessage(false)
      prevEntriesRef.current = finalEntries
    } else if (hasPersistedState) {
      // Update ref when we have persisted state to prevent unnecessary resets
      prevEntriesRef.current = finalEntries
    }
  }, [finalEntries, persistedState])

  // Cinematic column transition using ResizeObserver with staggered FLIP animation
  const containerWidthRef = React.useRef<number>(0)

  React.useEffect(() => {
    const container = resultsContainerRef.current
    if (!container) return

    const calculateColumns = () => {
      const width = container.clientWidth
      const cardWidth = 380
      const gap = 12
      return Math.max(1, Math.floor((width + gap) / (cardWidth + gap)))
    }

    const handleResize = () => {
      const newColumnCount = calculateColumns()

      // Use refs to check current values instead of stale closure values
      if (newColumnCount !== columnCountRef.current && !isTransitioningRef.current) {
        containerWidthRef.current = container.clientWidth

        // Start transition with staggered card animations
        setIsTransitioning(true)

        // Wait for next frame, then update column count
        animationFrameRef.current = requestAnimationFrame(() => {
          setColumnCount(newColumnCount)

          // End transition after animation completes
          transitionTimeoutRef.current = window.setTimeout(() => {
            setIsTransitioning(false)
            containerWidthRef.current = 0
          }, 500)
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      resizeObserver.disconnect()
    }
  }, []) // Empty dependency array - uses refs for current values

  const systemName = useMemo(() => {
    const gameType = combinationSize === 6 ? '6/49' : combinationSize === 7 ? 'LottoMax' : `${combinationSize}`
    return `${gameType} ${guarantee} of ${finalEntries} (${data.length})`
  }, [combinationSize, guarantee, finalEntries, data.length])

  const isLottoMax = combinationSize === 7
  const isLotto649 = combinationSize === 6

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

  const handlePaste = useCallback((startIndex: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text')
    const numbers = pastedText.split(/[\^0-9]+/).filter(n => n !== '')

    if (numbers.length > 1) {
      event.preventDefault()
      setShowValidationMessage(false)

      const indicesToUpdate: number[] = []
      for (let i = 0; i < numbers.length && (startIndex + i) < finalEntries; i++) {
        indicesToUpdate.push(startIndex + i)
      }

      setValues((currentValues) => {
        const nextValues = [...currentValues]
        indicesToUpdate.forEach((idx, i) => {
          const sanitizedValue = (numbers[i] as string).replace(/[^0-9]/g, '')
          nextValues[idx as number] = sanitizedValue === '' ? '' : String(Number(sanitizedValue))
        })
        return nextValues
      })

      setActiveEntries((currentActiveEntries) => {
        const nextActiveEntries = [...currentActiveEntries]
        indicesToUpdate.forEach((idx) => {
          nextActiveEntries[idx] = false
        })
        return nextActiveEntries
      })
    }
  }, [finalEntries])

  const anyEntryFilled = useMemo(() => values.some((value) => value !== ''), [values])
  const allEntriesFilled = useMemo(() => values.every((value) => value !== ''), [values])

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

  const validationMessages = useMemo(() => {
    return [
      duplicateIndices.size > 0 ? 'Entries must not contain duplicate numbers.' : null,
      outOfRangeIndices.size > 0 ? 'Numbers must be between 1 and 52.' : null,
    ].filter(Boolean)
  }, [duplicateIndices.size, outOfRangeIndices.size])

  const shouldShowValidationMessage = hasValidationErrors && showValidationMessage

  const handleToggle = useCallback((index: number) => {
    if (!isLocked) return

    setActiveEntries((currentActiveEntries) => {
      const nextActiveEntries = [...currentActiveEntries]
      const nextActive = !nextActiveEntries[index]
      nextActiveEntries[index] = nextActive

      if (nextActive) {
        setAnimatingIndex(index)
        // Store timeout ID for cleanup on unmount
        const animTimeoutId = window.setTimeout(() => setAnimatingIndex(null), 300)
        // Clean up any previous animation timeout
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

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current)
    }
  }, [])

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
    if (!allEntriesFilled) return

    if (hasValidationErrors) {
      setShowValidationMessage(true)
    } else {
      setValues((currentValues) => [...currentValues].sort((a, b) => Number(a) - Number(b)))
      setIsLocked(true)
      setShowValidationMessage(false)
    }
  }, [allEntriesFilled, hasValidationErrors])

  const handleEdit = useCallback(() => {
    setShowValidationMessage(false)
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
    setGoldenBallIndex(null)
    setIsLocked(false)
  }, [finalEntries])

  const handleRandom = useCallback(() => {
    const pool = Array.from({ length: 52 }, (_, i) => i + 1)
    const result: number[] = []
    for (let i = 0; i < finalEntries && pool.length > 0; i++) {
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
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
    setGoldenBallIndex(null)
  }, [finalEntries])

  const handleReset = useCallback(() => {
    setShowValidationMessage(false)
    setValues(Array.from({ length: finalEntries }, () => ''))
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
    setGoldenBallIndex(null)
    setIsLocked(false)
  }, [finalEntries])

  const snapshotCounts = useMemo(() => {
    const startCount = combinationSize === 6 ? 2 : 3
    return Array.from(
      { length: Math.max(combinationSize - startCount + 1, 0) },
      (_, index) => index + startCount
    )
  }, [combinationSize])

  const { rowCounts, matchSnapshot } = useMemo(() => {
    const snapshot: Record<number, number> = {}
    for (let i = 0; i < snapshotCounts.length; i++) {
      const key = snapshotCounts[i]
      if (key !== undefined) {
        snapshot[key] = 0
      }
    }

    const counts = data.map((row) => {
      let matchCount = 0
      for (let i = 0; i < row.length; i++) {
        const numIndex = row[i]
        if (numIndex !== undefined && values[numIndex] !== '' && activeEntries[numIndex]) {
          matchCount++
        }
      }

      if (snapshot[matchCount] !== undefined) {
        snapshot[matchCount] = (snapshot[matchCount] ?? 0) + 1
      }
      return matchCount
    })

    return { rowCounts: counts, matchSnapshot: snapshot }
  }, [data, values, activeEntries, snapshotCounts])

  const selectedCount = useMemo(() => activeEntries.filter((entry) => entry).length, [activeEntries])

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        {panelName && (
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{panelName}</p>
        )}
        {isLottoMax ? (
          <div className="flex items-center gap-3 flex-wrap">
            <img
              src={lottoMaxLogo}
              alt="Lotto Max"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-full object-contain"
            />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              {guarantee} of {finalEntries} ({data.length})
            </span>
          </div>
        ) : isLotto649 ? (
          <div className="flex items-center gap-3 flex-wrap">
            <img
              src={lotto649Logo}
              alt="Lotto 649"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto max-w-full object-contain"
            />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              {guarantee} of {finalEntries} ({data.length})
            </span>
          </div>
        ) : (
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">{systemName}</h1>
        )}
      </header>

      <Card className="glass-summary relative gap-0 p-0">
        <CardLabel label="Summary" />
        <CardContent className="p-2.5 sm:p-3 pt-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide justify-start">
            {snapshotCounts.map((countLabel) => (
              <SummaryItem
                key={countLabel}
                countLabel={String(countLabel)}
                countValue={(matchSnapshot[countLabel as number] ?? 0) as number}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-summary overflow-visible relative gap-0 p-0">
        <CardLabel label="Selections" />
        {shouldShowValidationMessage && validationMessages.length > 0 && (
          <div className="pointer-events-none absolute right-3 top-7 z-20 max-w-xs rounded-lg glass-card px-3 py-2 text-xs text-destructive shadow-lg animate-in fade-in zoom-in-95 duration-200">
            {validationMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}
        <CardHeader className="pb-2 pt-4 px-3 sm:px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {selectedCount > 0 ? `Won numbers ${selectedCount} of ${finalEntries} lucky` : 'Enter your numbers (double-click to set bonus ball)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4 px-3 sm:px-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 sm:gap-1">
            {values.map((value, index) => (
              <SystemInputCell
                key={index}
                index={index}
                value={value}
                isButtonMode={isLocked || false}
                isActive={activeEntries[index] || false}
                isGolden={(goldenBallIndex === index) as boolean}
                hasError={showValidationMessage && (duplicateIndices.has(index) || outOfRangeIndices.has(index))}
                onValueChange={handleInputChange}
                onPaste={handlePaste}
                onToggle={handleToggle}
                onDoubleToggle={handleDoubleToggle}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 border-t border-border/50">
            {isLocked && (
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                className="h-10 w-20 font-semibold shrink-0"
              >
                EDIT
              </Button>
            )}
            {!isLocked && (
              <Button
                type="button"
                onClick={handleSet}
                disabled={!allEntriesFilled}
                className="h-10 w-20 font-semibold shrink-0"
              >
                SET
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              onClick={anyEntryFilled ? handleReset : handleRandom}
              className="h-10 w-20 font-semibold shrink-0"
            >
              {anyEntryFilled ? 'RESET' : 'RANDOM'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-muted/10 p- sm:p-5 relative">
        <CardLabel label="Results" />
        <div ref={resultsContainerRef} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),380px))] gap-3 pt-6 sm:pt-7 overflow-x-auto">
          {data.map((row, rowIndex) => (
            <LottoRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              values={values}
              activeEntries={activeEntries}
              goldenBallIndex={goldenBallIndex}
              count={(rowCounts[rowIndex] ?? 0) as number}
              combinationSize={combinationSize}
              animatingIndex={animatingIndex}
              columnIndex={rowIndex % columnCount}
              isTransitioning={isTransitioning}
              columnCount={columnCount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
