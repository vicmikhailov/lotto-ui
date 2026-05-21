import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ballActive =
  'size-10 rounded-full font-semibold transition-all border-0 ' +
  'bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-700 ' +
  '[box-shadow:inset_2px_3px_8px_rgba(255,255,255,0.95),inset_-2px_-3px_6px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.2)]'

const ballInactive =
  'size-10 rounded-full font-semibold transition-all border-0 ' +
  'translate-y-px bg-gradient-to-br from-slate-200/80 via-slate-300/70 to-slate-500/70 text-slate-500/70 ' +
  '[box-shadow:inset_4px_4px_8px_rgba(0,0,0,0.18),inset_-3px_-3px_6px_rgba(255,255,255,0.35),inset_0_1px_2px_rgba(0,0,0,0.12)]'

const SystemInputCell = memo(function SystemInputCell({
  index,
  value,
  isButtonMode,
  isActive,
  hasError,
  onValueChange,
  onToggle,
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
        {index + 1}
      </span>

      {isButtonMode ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onToggle(index)}
          aria-pressed={isActive}
          className={cn(
            isActive ? ballActive : ballInactive
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
          value={value}
          onChange={(e) => onValueChange(index, e.target.value)}
          className={cn(
            'h-10 w-12 rounded-md border bg-background text-center text-sm font-semibold transition-all focus:outline-none focus:ring-2',
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

