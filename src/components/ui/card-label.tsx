import { cn } from '@/lib/utils'

export interface CardLabelProps {
  /** Label text to display */
  label: string
  /** Additional CSS classes to apply */
  className?: string
}

/**
 * Reusable card label component - displays a subtle watermark-style heading in the top-right corner of a card
 *
 * @example
 * ```tsx
 * <Card className="relative">
 *   <CardLabel label="Selections" />
 *   <CardContent>...</CardContent>
 * </Card>
 * ```
 */
export function CardLabel({ label, className }: CardLabelProps) {
  return (
    <div className={cn(
      "absolute top-0 right-2 z-10 pointer-events-none",
      className
    )}>
      <span
        className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60"
        style={{
          fontVariant: 'small-caps',
          letterSpacing: '0.15em'
        }}
      >
        {label}
      </span>
    </div>
  )
}
