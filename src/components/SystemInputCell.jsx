import { memo, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ballActive =
  'size-9 sm:size-10 rounded-full font-semibold transition-all border-0 ' +
  'bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-700 ' +
  '[box-shadow:inset_2px_3px_8px_rgba(255,255,255,0.95),inset_-2px_-3px_6px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.2)]'

const ballGold =
  'size-9 sm:size-10 rounded-full font-semibold transition-all border-0 ' +
  'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 text-amber-950 ' +
  '[box-shadow:inset_2px_3px_8px_rgba(255,255,255,0.8),inset_-2px_-3px_6px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.3)]'

const ballInactive =
  'size-9 sm:size-10 rounded-full font-semibold transition-all border-0 ' +
  'translate-y-px bg-gradient-to-br from-slate-200/80 via-slate-300/70 to-slate-500/70 text-slate-500/70 ' +
  '[box-shadow:inset_4px_4px_8px_rgba(0,0,0,0.18),inset_-3px_-3px_6px_rgba(255,255,255,0.35),inset_0_1px_2px_rgba(0,0,0,0.12)]'

const SINGLE_CLICK_DELAY_MS = 150

const SystemInputCell = memo(function SystemInputCell({
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
}) {
  const clickTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const handleClick = useCallback((event) => {
    if (event.detail === 0) {
      // Keyboard-triggered click (Enter/Space) should behave like a single toggle.
      onToggle(index)
      return
    }

    if (event.detail !== 1) {
      return
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      onToggle(index)
      clickTimeoutRef.current = null
    }, SINGLE_CLICK_DELAY_MS)
  }, [index, onToggle])

  const handleDoubleClick = useCallback(() => {
    if (clickTimeoutRef.current !== null) {
      window.clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }
    onDoubleToggle(index, isGolden)
  }, [index, isGolden, onDoubleToggle])

  const handleKeyDown = useCallback((event) => {
    if (!event.shiftKey) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onDoubleToggle(index, isGolden)
    }
  }, [index, isGolden, onDoubleToggle])

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
        {index + 1}
      </span>

      {isButtonMode ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          aria-pressed={isActive}
          aria-label={`Entry ${index + 1}: ${value}. Double-click set bonus ball.`}
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

export default SystemInputCell

