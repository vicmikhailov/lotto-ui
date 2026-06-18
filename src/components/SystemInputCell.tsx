import { memo, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SystemInputCellProps } from '@/types'

const ballActive =
  'size-9 sm:size-10 rounded-full font-semibold transition-all border-0 ' +
  'ball-ivory text-slate-800 hover:scale-110'

const ballGold =
  'size-9 sm:size-10 rounded-full font-semibold transition-all border-0 ' +
  'ball-gold text-amber-900 hover:scale-110'

const ballInactive =
  'size-9 sm:size-10 rounded-full font-medium transition-all border-0 ' +
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

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!event.shiftKey) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onDoubleToggle(index, isGolden)
    }
  }, [index, isGolden, onDoubleToggle])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
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
          aria-label={`Entry ${index + 1}: ${value}. Click to select, double-click for bonus ball.`}
          className={cn(
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
          aria-label={`Entry ${index + 1}`}
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
          className={cn(
            'h-9 w-11 sm:h-10 sm:w-12 rounded-md border bg-background text-center text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2',
            hasError
              ? 'border-destructive/60 focus:ring-destructive/20'
              : 'border-border focus:ring-primary/20'
          )}
        />
      )}
    </div>
  )
})
