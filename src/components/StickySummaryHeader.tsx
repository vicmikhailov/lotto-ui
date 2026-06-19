import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface SummaryItemProps {
  countLabel: string
  countValue: number
}

const SummaryItem = ({ countLabel, countValue }: SummaryItemProps) => (
  <div className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 shadow-sm">
    <div className={cn(
      'inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md px-2 text-sm font-bold leading-none border-0',
      countValue === 0
        ? 'bg-muted text-muted-foreground'
        : 'ball-ivory text-slate-800'
    )}>
      {countLabel}
    </div>
    <span className="inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-md px-2 text-sm font-bold leading-none">
      {countValue}
    </span>
  </div>
)

interface StickySummaryHeaderProps {
  snapshotCounts: number[]
  matchSnapshot: Record<number, number>
}

export default function StickySummaryHeader({ snapshotCounts, matchSnapshot }: StickySummaryHeaderProps) {
  return (
    <Card className="border-0 bg-transparent shadow-none sticky top-[56px] md:top-14 z-40">
      <CardContent className="p-0 py-1">
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
  )
}
