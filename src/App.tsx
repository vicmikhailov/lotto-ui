import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import About from '@/components/About'
import LottoIcon from '@/components/LottoIcon'
import BottomBar from '@/components/BottomBar'

import { PAGES, LOTTO_COMPONENTS } from '@/config/pages'
import type { LottoGameState } from '@/types'

/**
 * Wrapper component to render lotto games with persisted state
 */
function LottoComponentRenderer({
  component: Component,
  persistedState,
  onStateChange,
}: {
  component: React.ComponentType<{ persistedState?: LottoGameState; onStateChange?: (state: LottoGameState) => void }>
  persistedState?: LottoGameState | null
  onStateChange?: ((state: LottoGameState) => void) | null
}) {
  const props = {} as { persistedState?: LottoGameState; onStateChange?: (state: LottoGameState) => void }
  if (persistedState !== null && persistedState !== undefined) {
    props.persistedState = persistedState
  }
  if (onStateChange !== null && onStateChange !== undefined) {
    props.onStateChange = onStateChange
  }
  return <Component {...props} />
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [isOpen, setIsOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  // Persist game state per game type
  const [gameStates, setGameStates] = useState<Record<string, LottoGameState>>({})

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)

    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Stabilize the onStateChange callback to prevent unnecessary re-renders
  const handleStateChange = useCallback((pageId: string, newState: LottoGameState) => {
    console.log('[App] State change for', pageId, ':', {
      values: newState.values,
      activeEntries: newState.activeEntries,
      isLocked: newState.isLocked
    })
    setGameStates(prev => ({
      ...prev,
      [pageId]: newState
    }))
  }, [])

  // Memoize the current page's state handler
  const currentPageStateHandler = useMemo(() => {
    if (currentPage === 'home' || currentPage === 'about') return undefined
    return (newState: LottoGameState) => handleStateChange(currentPage, newState)
  }, [currentPage, handleStateChange])

  return (
    <>
      <div className="flex min-h-dvh bg-background text-foreground transition-colors duration-300">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <BottomBar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isOpen ? "md:ml-64" : "md:ml-16"
        )}>
        <div className="mx-auto min-h-dvh max-w-6xl px-6 py-8 sm:px-10 lg:px-12">
          {currentPage === 'home' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {PAGES.filter(page => page.id !== 'about').map((page, idx) => (
                <Card
                  key={page.id}
                  className={cn(
                    "cursor-pointer border-0 rounded-xl overflow-hidden",
                    "card-enhanced-hover group",
                    "animate-card-entry",
                    getAnimationDelayClass(idx)
                  )}
                  onClick={() => setCurrentPage(page.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 relative z-10">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary/10 shadow-sm">
                      {page.id.includes('-') ? (
                        <LottoIcon label={page.label} className="size-7" />
                      ) : (
                        <page.icon className="size-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl sm:text-2xl truncate">{page.label}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Tap to play</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {currentPage === 'about' && (
            <div className="animate-in fade-in duration-500">
              <About />
            </div>
          )}

          {currentPage !== 'home' && currentPage !== 'about' && (() => {
            const SelectedLottoComponent = LOTTO_COMPONENTS[currentPage]
            return SelectedLottoComponent ? (
              <div className="animate-in fade-in duration-500">
                <LottoComponentRenderer
                  component={SelectedLottoComponent}
                  persistedState={gameStates[currentPage] ?? null}
                  onStateChange={currentPageStateHandler ?? null}
                />
              </div>
            ) : null
          })()}
        </div>
        </main>
      </div>
    </>
  )
}

export default App

/**
 * Get animation delay class based on index
 */
function getAnimationDelayClass(index: number): string {
  const delays = [
    'animate-card-delay-0',
    'animate-card-delay-1',
    'animate-card-delay-2',
    'animate-card-delay-3',
    'animate-card-delay-4',
    'animate-card-delay-5',
    'animate-card-delay-6',
    'animate-card-delay-7',
    'animate-card-delay-8',
    'animate-card-delay-9',
    'animate-card-delay-10',
  ]
  return delays[index] ?? 'animate-card-delay-0'
}