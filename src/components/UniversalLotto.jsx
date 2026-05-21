import { useEffect, useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import SystemInputCell from '@/components/SystemInputCell'

const ballActive =
  'size-10 rounded-full font-semibold transition-all cursor-default border-0 ' +
  'bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-700 ' +
  '[box-shadow:inset_2px_3px_8px_rgba(255,255,255,0.95),inset_-2px_-3px_6px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.2)]'

const ballInactive =
  'size-10 rounded-full font-semibold transition-all cursor-default border-0 ' +
  'bg-gradient-to-br from-muted/50 via-muted/30 to-muted/10 text-muted-foreground/40 ' +
  '[box-shadow:inset_1px_1px_3px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'

const getDefaultValues = (totalEntries) =>
  Array.from({ length: totalEntries }, (_, i) => (i + 1).toString())

const generateUniqueRandomValues = (totalEntries, maxValue) => {
  const generatedValues = new Set()

  while (generatedValues.size < totalEntries) {
    generatedValues.add(Math.floor(Math.random() * maxValue) + 1)
  }

  return Array.from(generatedValues, (value) => value.toString())
}

const getCountBadgeClass = (count) => {
  if (count <= 2) return ''
  if (count === 3) return 'bg-zinc-300 text-zinc-950 hover:bg-zinc-300 border-transparent'
  if (count === 4) return 'bg-[#FDFBD4] text-slate-950 hover:bg-[#FDFBD4] border-transparent'
  if (count === 5) return 'bg-[#CF6DFC] text-slate-950 hover:bg-[#CF6DFC] border-transparent'
  if (count === 6) return 'bg-slate-950 text-[#BDB96A] hover:bg-slate-950 border-transparent ring-1 ring-[#BDB96A]/50'
  return 'bg-[#312A5C] text-[#C1BFFF] hover:bg-[#312A5C] border-transparent ring-1 ring-[#C1BFFF]/50'
}

export default function UniversalLotto({ data = [], guarantee, entries }) {
  const combinationSize = data[0]?.length || 0

  const maxIndex = useMemo(() => {
    return data.length > 0 ? Math.max(...data.flat()) : -1
  }, [data])

  const calculatedEntries = maxIndex + 1
  const finalEntries = entries || calculatedEntries
  const maxAllowedValue = combinationSize === 6 ? 49 : 52

  const [values, setValues] = useState(() => getDefaultValues(finalEntries))
  const [activeEntries, setActiveEntries] = useState(() => Array.from({ length: finalEntries }, () => false))
  const [showValidationMessage, setShowValidationMessage] = useState(false)
  const [prevEntries, setPrevEntries] = useState(finalEntries)

  if (finalEntries !== prevEntries) {
    setValues(getDefaultValues(finalEntries))
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
    setShowValidationMessage(false)
    setPrevEntries(finalEntries)
  }

  const systemName = `${combinationSize}-${guarantee}-${finalEntries} (${data.length})`

  const handleInputChange = useCallback((index, value) => {
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

  const allEntriesFilled = useMemo(() => values.every((value) => value !== ''), [values])
  const allEntriesEmpty = useMemo(() => values.every((value) => value === ''), [values])

  // Single pass calculation of duplicate and out-of-range indices
  const { duplicateIndices, outOfRangeIndices, hasValidationErrors } = useMemo(() => {
    const counts = {}
    for (const value of values) {
      if (value !== '') {
        counts[value] = (counts[value] || 0) + 1
      }
    }

    const dupIndices = new Set()
    const rangeIndices = new Set()

    values.forEach((value, index) => {
      if (value !== '') {
        if (counts[value] > 1) {
          dupIndices.add(index)
        }
        const numericValue = Number(value)
        if (Number.isNaN(numericValue) || numericValue < 1 || numericValue > maxAllowedValue) {
          rangeIndices.add(index)
        }
      }
    })

    return {
      duplicateIndices: dupIndices,
      outOfRangeIndices: rangeIndices,
      hasValidationErrors: dupIndices.size > 0 || rangeIndices.size > 0
    }
  }, [values, maxAllowedValue])

  const canUseButtonMode = allEntriesFilled && !hasValidationErrors

  const validationMessages = useMemo(() => {
    return [
      duplicateIndices.size > 0 ? 'Entries must not contain duplicate numbers.' : null,
      outOfRangeIndices.size > 0 ? `Numbers must be between 1 and ${maxAllowedValue}.` : null,
    ].filter(Boolean)
  }, [duplicateIndices.size, outOfRangeIndices.size, maxAllowedValue])

  const shouldShowValidationMessage = hasValidationErrors && (allEntriesFilled || showValidationMessage)

  useEffect(() => {
    if (!hasValidationErrors || allEntriesFilled) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setShowValidationMessage(true)
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [allEntriesFilled, hasValidationErrors, values])

  const handleToggle = useCallback((index) => {
    if (!allEntriesFilled || hasValidationErrors) {
      return
    }

    setActiveEntries((currentActiveEntries) => {
      const nextActiveEntries = [...currentActiveEntries]
      nextActiveEntries[index] = !nextActiveEntries[index]
      return nextActiveEntries
    })
  }, [allEntriesFilled, hasValidationErrors])

  const handleReset = useCallback(() => {
    setShowValidationMessage(false)
    setValues(Array.from({ length: finalEntries }, () => ''))
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
  }, [finalEntries])

  const handleRandom = useCallback(() => {
    setShowValidationMessage(false)
    const maxRandomValue = combinationSize === 6 ? 49 : 52
    const randomizedValues = generateUniqueRandomValues(finalEntries, maxRandomValue)

    setValues(randomizedValues)
    setActiveEntries(Array.from({ length: finalEntries }, () => false))
  }, [finalEntries, combinationSize])

  const snapshotCounts = useMemo(() => {
    return Array.from(
      { length: Math.max(combinationSize - 2, 0) },
      (_, index) => index + 3
    )
  }, [combinationSize])

  const matchSnapshot = useMemo(() => {
    const counts = Object.fromEntries(snapshotCounts.map((count) => [count, 0]))
    for (const row of data) {
      let count = 0
      for (const numIndex of row) {
        if (values[numIndex] !== '' && activeEntries[numIndex]) {
          count++
        }
      }
      if (count >= 3 && count <= combinationSize) {
        counts[count] = (counts[count] || 0) + 1
      }
    }
    return counts
  }, [data, values, activeEntries, snapshotCounts, combinationSize])

  const selectedCount = useMemo(() => activeEntries.filter((entry) => entry).length, [activeEntries])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">{systemName}</h1>
      </header>

      <Card className="border-2 border-system-input-border bg-system-input backdrop-blur-sm shadow-sm">
        <CardContent className="px-4 py-0">
          <div className="flex flex-wrap gap-1">
            {snapshotCounts.map((countLabel) => (
              <div
                key={countLabel}
                className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-7 rounded-full text-xs font-bold cursor-default border-0 transition-all text-slate-700 bg-gradient-to-br from-white via-slate-100 to-slate-300 [box-shadow:inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-1px_-2px_4px_rgba(0,0,0,0.2),0_3px_7px_rgba(0,0,0,0.2)]"
                >
                  {countLabel}
                </Button>
                <span
                  className={cn(
                    'inline-flex h-7 min-w-9 items-center justify-center rounded-md px-2 text-sm font-bold leading-none border-0',
                    matchSnapshot[countLabel] === 0
                      ? 'text-muted-foreground/50'
                      : 'text-foreground'
                  )}
                >
                  {matchSnapshot[countLabel]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="relative border-2 border-system-input-border bg-system-input backdrop-blur-sm shadow-sm overflow-visible">
        {shouldShowValidationMessage && validationMessages.length > 0 && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 max-w-xs rounded-lg border border-destructive/25 bg-background/95 px-3 py-2 text-xs text-destructive shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            {validationMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Won numbers {selectedCount} of {finalEntries} lucky
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-4 pb-6">
          {values.map((value, index) => (
            <SystemInputCell
              key={index}
              index={index}
              value={value}
              isButtonMode={canUseButtonMode}
              isActive={activeEntries[index]}
              hasError={duplicateIndices.has(index) || outOfRangeIndices.has(index)}
              onValueChange={handleInputChange}
              onToggle={handleToggle}
            />
          ))}
          <div className="flex items-end">
            {allEntriesEmpty ? (
              <Button type="button" onClick={handleRandom} className="h-10">
                Random
              </Button>
            ) : (
              <Button type="button" variant="destructive" onClick={handleReset} className="h-10">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-muted/10 p-6">
        <div className={cn(
          "grid gap-4",
          combinationSize <= 6
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 lg:grid-cols-2"
        )}>
          {data.map((row, rowIndex) => {
            const count = row.filter((numIndex) => values[numIndex] !== '' && activeEntries[numIndex]).length
            return (
              <Card key={rowIndex} className="border-border/50 shadow-sm relative">
                <div className="absolute top-1 left-2 text-[10px] text-muted-foreground/50 font-medium">
                  {rowIndex + 1}
                </div>
                <CardContent className="flex items-center justify-between gap-2 sm:gap-3 py-2">
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${combinationSize}, minmax(0, 1fr))`
                    }}
                  >
                    {row.map((numIndex, itemIndex) => {
                      const hasValue = values[numIndex] !== ''
                      const isSelected = hasValue && activeEntries[numIndex]

                      return (
                        <Button
                          key={itemIndex}
                          variant="outline"
                          size="icon"
                          className={cn(
                            isSelected ? ballActive : ballInactive
                          )}
                        >
                          {values[numIndex] || ''}
                        </Button>
                      )
                    })}
                  </div>
                  <div className="border-l border-border/50 pl-2 sm:pl-4 h-10 flex items-center">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "size-10 rounded-md flex items-center justify-center text-sm font-bold p-0",
                        getCountBadgeClass(count)
                      )}
                    >
                      {count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
