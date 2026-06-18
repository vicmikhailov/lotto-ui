import React, { useMemo } from 'react'
import { LayoutGrid, ChevronDown, MoreVertical, Menu } from 'lucide-react'

interface AppBarProps {
  darkMode: boolean
  onDarkToggle: () => void
}

export default function AppBar({ darkMode, onDarkToggle }: AppBarProps) {
  // Memoize game list to prevent re-creation on every render
  const gamesList = useMemo(() => [
    '6-4-9 (12)',
    '6-4-10 (20)',
    '6-4-11 (33)',
    '6-4-12 (48)',
    '6-5-8 (12)',
    '6-5-9 (30)',
    '6-5-10 (50)',
    '7-5-8 (6)',
    '7-5-9 (9)',
    '7-5-10 (21)',
    '7-5-11 (36)',
  ], [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo (always visible) */}
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          <span className="font-semibold hidden sm:inline">Lotto UI</span>
        </div>

        {/* Center - Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Games Dropdown - CSS-only hover */}
          <div className="group relative">
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md group-hover:bg-accent transition-colors"
            >
              Games
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {/* Games Dropdown Menu - shows on parent hover */}
            <div className="absolute left-0 top-full z-50 mt-1 w-[280px] rounded-md border bg-popover p-1 shadow-lg group-hover:block hidden animate-in fade-in slide-in-from-top-1">
              <div className="grid grid-cols-2 gap-1 p-1">
                {gamesList.map((game) => (
                    <button
                      key={game}
                      className="px-3 py-2 text-sm text-left rounded-md hover:bg-accent transition-colors"
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </nav>

        {/* Right side - User actions */}
        <div className="flex items-center gap-1">
          {/* Dark mode toggle */}
          <button
            onClick={onDarkToggle}
            className="p-2 rounded-md hover:bg-accent transition-colors hidden sm:flex"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <span className="text-sm font-medium">Light</span>
            ) : (
              <span className="text-sm font-medium">Dark</span>
            )}
          </button>

          {/* Context menu button */}
          <button className="p-2 rounded-md hover:bg-accent transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Mobile hamburger menu */}
          <button className="p-2 rounded-md hover:bg-accent transition-colors md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
