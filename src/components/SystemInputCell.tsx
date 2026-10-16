import { memo, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SystemInputCellProps } from '@/types'

const ballActive =
  'size-9 sm:size-12 rounded-full font-semibold transition-all border-0 ' +
  'ball-ivory text-slate-800 hover:scale-110 active:scale-95'

const ballGold =
  'size-9 sm:size-12 rounded-full font-semibold transition-all border-0 ' +
  'ball-gold text-amber-900 hover:scale-110 active:scale-95'

const ballInactive =
  'size-9 sm:size-12 rounded-full font-medium transition-all border-0 ' +
  'ball-inactive hover:scale-105'

const DOUBLE_TAP_DELAY_MS = 250

export default memo(function SystemInputCell({
  index,
  value,
  isButtonMode,
  isActive,
  isGolden,
  hasError,
  onValueChange,
  onPaste,
  onToggle,
  onDoubleToggle,
}: SystemInputCellProps) {
  const clickTimeoutRef = useRef<number | null>(null)
  const lastTapTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // Keyboard-triggered click (Enter/Space) should behave like a single toggle.
    if (event.detail === 0) {
      onToggle(index)
      return
    }

    // Ignore double-click events here - handleDoubleClick will process them
    if (event.detail !== 1) {
      return
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      onToggle(index)
      clickTimeoutRef.current = null
    }, DOUBLE_TAP_DELAY_MS)
  }, [index, onToggle])

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault() // Prevent emulated mouse click

    const now = Date.now()
    const timeSinceLastTap = now - lastTapTimeRef.current

    if (timeSinceLastTap > 0 && timeSinceLastTap <= DOUBLE_TAP_DELAY_MS) {
      // Double tap detected
      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current)
        clickTimeoutRef.current = null
      }
      onDoubleToggle(index, isGolden)
    } else {
      // Single tap - schedule for confirmation
      lastTapTimeRef.current = now
      clickTimeoutRef.current = window.setTimeout(() => {
        onToggle(index)
        clickTimeoutRef.current = null
      }, DOUBLE_TAP_DELAY_MS)
    }
  }, [index, isGolden, onToggle, onDoubleToggle])

  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (clickTimeoutRef.current !== null) {
      window.clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }
    onDoubleToggle(index, isGolden)
  }, [index, isGolden, onDoubleToggle])

  // Enhanced keyboard navigation with arrow keys
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Shift+Enter or Shift+Space for double-toggle (bonus ball)
    if (event.shiftKey && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onDoubleToggle(index, isGolden)
      return
    }

    // Arrow key navigation between inputs
    const inputElements = document.querySelectorAll('[data-lotto-input]')
    const currentIndex = Array.from(inputElements).indexOf(event.currentTarget as unknown as Element)

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        if (currentIndex < inputElements.length - 1) {
          ;(inputElements[currentIndex + 1] as HTMLElement)?.focus()
        }
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (currentIndex > 0) {
          ;(inputElements[currentIndex - 1] as HTMLElement)?.focus()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        // Navigate up by 5 (assuming ~5 columns in grid)
        if (currentIndex >= 5) {
          ;(inputElements[currentIndex - 5] as HTMLElement)?.focus()
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        // Navigate down by 5 (assuming ~5 columns in grid)
        if (currentIndex < inputElements.length - 5) {
          ;(inputElements[currentIndex + 5] as HTMLElement)?.focus()
        }
        break
    }
  }, [index, isGolden, onDoubleToggle])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-muted-foreground/60 uppercase">
        {index + 1}
      </span>

      {isButtonMode ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          aria-pressed={isActive}
          data-lotto-input
          data-entry={index}
          aria-label={`Entry ${index + 1}: ${value}. Click or press Space to select, Shift+Space for bonus ball. Use arrow keys to navigate.`}
          className={cn(
            // WCAG 2.5.5: Touch targets must be at least 48x48px for improved usability
            'min-h-[48px] min-w-[48px] w-12 h-12 sm:w-13 sm:h-13 text-base font-semibold',
            'transition-all duration-200',
            isGolden ? ballGold : isActive ? ballActive : ballInactive
          )}
        >
          {value}
        </Button>
      ) : (
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          required
          aria-invalid={hasError}
          data-lotto-input
          data-entry={index}
          aria-label={`Entry ${index + 1}. Use arrow keys to navigate between entries.`}
          value={value}
          onChange={(e) => onValueChange(index, e.target.value)}
          onPaste={(e) => onPaste?.(index, e)}
          onClick={() => {
            const now = Date.now()
            if (now - lastTapTimeRef.current <= DOUBLE_TAP_DELAY_MS) {
              onDoubleToggle(index, isGolden)
            } else {
              lastTapTimeRef.current = now
            }
          }}
          // WCAG 2.5.5: Touch targets at least 48x48px for improved usability
          className={cn(
            'h-12 w-13 rounded-lg border bg-background text-center text-base font-semibold transition-all focus:outline-none focus:ring-2',
            'min-h-[48px] min-w-[48px]',
            hasError
              ? 'border-destructive/60 focus:ring-destructive/20'
              : 'border-border focus:ring-primary/20'
          )}
        />
      )}
    </div>
  )
})
