import { useState, useEffect, memo } from 'react'
import { Menu, X, SunMedium, MoonStar, ChevronLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LottoIcon from './LottoIcon'
import { SIDEBAR_ITEMS } from '@/config/pages'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (pageId: string) => void
  darkMode: boolean
  setDarkMode: (isDark: boolean) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default memo(function Sidebar({
  currentPage,
  setCurrentPage,
  darkMode,
  setDarkMode,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const mobile = width < 768
      setIsMobile(mobile)

      // Auto-collapse on small screens
      if (width < 1024 && width >= 768) {
        setIsOpen(false)
      } else if (width >= 1024) {
        setIsOpen(true)
      } else if (width < 768) {
        // Close sidebar on mobile transition
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen])

  const toggleSidebar = () => setIsOpen(!isOpen)

// Sidebar icon ball styles - matching game balls with ivory look
const sidebarBallInactive =
  'size-9 rounded-full flex items-center justify-center shrink-0 border-0 ' +
  'ball-inactive text-slate-400/60 hover:scale-105 transition-all'

const sidebarBallActive =
  'size-9 rounded-full flex items-center justify-center shrink-0 border-0 ' +
  'ball-ivory text-slate-800 scale-105'

return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden",
          isOpen && isMobile && "left-[240px]"
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-45 flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0"
        )}
      >
        <nav className="flex-1 space-y-2 p-2 pt-3">
          {/* Home row - click to open sidebar */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? "secondary" : "ghost"}
              className={cn(
                "flex-1 justify-start gap-3 group relative overflow-hidden transition-all duration-300",
                !isOpen && "justify-center px-0",
                currentPage === 'home'
                  ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent"
                  : "hover:bg-muted/50 hover:translate-x-0.5"
              )}
              onClick={() => {
                if (!isOpen) {
                  setIsOpen(true)
                } else {
                  setCurrentPage('home')
                  if (isMobile) setIsOpen(false)
                }
              }}
            >
              {/* Active indicator bar */}
              {currentPage === 'home' && isOpen && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 via-primary to-primary/60" />
              )}
              <div className={cn(
                "size-9 rounded-full flex items-center justify-center shrink-0 border-0",
                currentPage === 'home' && isOpen
                  ? sidebarBallActive
                  : sidebarBallInactive
              )}>
                <Home className="size-5" />
              </div>
              {isOpen && <span>Home</span>}
            </Button>
            {/* Close button - visible only when sidebar is open */}
            {isOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setIsOpen(false)}
                title="Close sidebar"
              >
                <ChevronLeft className="size-4" />
              </Button>
            )}
          </div>

          {/* Other menu items */}
          {SIDEBAR_ITEMS.filter(item => item.id !== 'home').map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 group relative overflow-hidden transition-all duration-300",
                !isOpen && "justify-center px-0",
                currentPage === item.id
                  ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent"
                  : "hover:bg-muted/50 hover:translate-x-0.5"
              )}
              onClick={() => {
                setCurrentPage(item.id)
                if (isMobile) setIsOpen(false)
              }}
            >
              {/* Active indicator bar */}
              {currentPage === item.id && isOpen && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 via-primary to-primary/60" />
              )}
              <div className={cn(
                "size-9 rounded-full flex items-center justify-center shrink-0 border-0",
                currentPage === item.id && isOpen
                  ? sidebarBallActive
                  : sidebarBallInactive
              )}>
                {item.id.includes('-') ? (
                  <LottoIcon label={item.label} className="size-5" />
                ) : item.icon ? (
                  <item.icon className="size-5" />
                ) : null}
              </div>
              {isOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3",
              !isOpen && "justify-center px-0"
            )}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="size-9 rounded-full flex items-center justify-center shrink-0 border-0 ball-ivory text-slate-800">
              {darkMode ? (
                <SunMedium className="size-5 text-lime-500" />
              ) : (
                <MoonStar className="size-5 text-sky-600" />
              )}
            </div>
            {isOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>
        </div>
      </aside>
    </>
  )
})
