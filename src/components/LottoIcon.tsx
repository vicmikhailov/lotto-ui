import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { LottoIconProps } from '@/types'

const LottoIcon = memo(function LottoIcon({ label, className }: LottoIconProps) {
  // label is like "7-5-8 (6)" or "7-5-10 (21)"
  const match = label.match(/(\d+)-(\d+)-(\d+)/)
  if (!match) return null

  const n1 = match[1]
  const n2 = match[2]
  const n3 = match[3]

  return (
    <div className={cn(
      "relative flex items-center justify-center font-bold tracking-tighter rounded-full transition-all duration-300 shadow-sm",
      "bg-secondary text-secondary-foreground border border-border/40",
      "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:scale-110 group-hover:shadow-md",
      "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 hover:shadow-md",
      className
    )}>
      <span className="transition-transform duration-300 -translate-y-[15%] text-[0.65rem]">{n1}</span>
      <span className="transition-transform duration-300 translate-y-[15%] text-[0.65rem] opacity-80 group-hover:opacity-100">{n2}</span>
      <span className="transition-transform duration-300 -translate-y-[15%] text-[0.65rem]">{n3}</span>
    </div>
  )
})

LottoIcon.displayName = 'LottoIcon'

export default LottoIcon
