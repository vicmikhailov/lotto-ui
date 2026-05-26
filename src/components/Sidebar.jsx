import { useState, useEffect, memo } from 'react'
import { Menu, X, SunMedium, MoonStar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import LottoIcon from './LottoIcon'
import { SIDEBAR_ITEMS } from '@/config/pages'

const Sidebar = memo(({ currentPage, setCurrentPage, darkMode, setDarkMode, isOpen, setIsOpen }) => {
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
        <div className="flex h-16 items-center justify-between px-4 py-4">
          {isOpen && <span className="text-xl font-bold tracking-tight">Coverlot</span>}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </Button>
        </div>

        <nav className="flex-1 space-y-2 p-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 group",
                !isOpen && "justify-center px-0"
              )}
              onClick={() => {
                setCurrentPage(item.id)
                if (isMobile) setIsOpen(false)
              }}
            >
              {item.id.includes('-') ? (
                <LottoIcon label={item.label} className="size-7 shrink-0" />
              ) : item.icon ? (
                <item.icon className="size-5 shrink-0" />
              ) : null}
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
            {darkMode ? (
              <SunMedium className="size-5 shrink-0 text-yellow-500" />
            ) : (
              <MoonStar className="size-5 shrink-0 text-blue-500" />
            )}
            {isOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>
        </div>
      </aside>
    </>
  )
})

export default Sidebar
