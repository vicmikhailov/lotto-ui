import { Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const bottomNavItems = [
  { id: 'home', label: 'Home', icon: Home },
]

interface BottomBarProps {
  currentPage: string
  setCurrentPage: (pageId: string) => void
}

export default function BottomBar({ currentPage, setCurrentPage }: BottomBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" aria-label="Main navigation">
      <div className="flex items-center justify-around border-t bg-background/95 backdrop-blur px-4 py-2">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              // WCAG 2.5.5: Touch targets at least 44x44px
              'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[48px] min-w-[48px]',
              currentPage === item.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={currentPage === item.id ? 'page' : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
