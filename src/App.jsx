import { useEffect, useState } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import About from '@/components/About'
import Lotto758 from '@/components/Lotto758'
import Lotto759 from '@/components/Lotto759'
import Lotto7510 from '@/components/Lotto7510'
import Lotto7511 from '@/components/Lotto7511'
import Lotto658 from '@/components/Lotto658'
import Lotto659 from '@/components/Lotto659'
import Lotto6411 from '@/components/Lotto6411'
import Lotto6412 from '@/components/Lotto6412'
import Lotto6510 from '@/components/Lotto6510'

import LottoIcon from '@/components/LottoIcon'
import Lotto649 from "@/components/Lotto649.jsx"
import Lotto6410 from "@/components/Lotto6410.jsx"
import ErrorBoundary from '@/components/ErrorBoundary'

import { PAGES } from '@/config/pages'

const LOTTO_COMPONENTS = {
  '6-4-9-12': Lotto649,
  '6-4-10-20': Lotto6410,
  '6-4-11-33': Lotto6411,
  '6-4-12-48': Lotto6412,
  '6-5-8-12': Lotto658,
  '6-5-9-30': Lotto659,
  '6-5-10-50': Lotto6510,
  '7-5-8-6': Lotto758,
  '7-5-9-9': Lotto759,
  '7-5-10-21': Lotto7510,
  '7-5-11-36': Lotto7511,
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [isOpen, setIsOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)

    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <ErrorBoundary>
      <div className="flex min-h-dvh bg-background text-foreground transition-colors duration-300">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isOpen ? "md:ml-64" : "md:ml-16"
        )}>
          <div className="mx-auto min-h-dvh max-w-6xl px-6 py-8 sm:px-10 lg:px-12">
            {currentPage === 'home' && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 animate-in fade-in duration-500">
                {PAGES.map((page) => (
                  <Card
                    key={page.id}
                    className="cursor-pointer border border-border/60 bg-card/80 backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground group"
                    onClick={() => setCurrentPage(page.id)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary/10">
                        {page.id.includes('-') ? (
                          <LottoIcon label={page.label} className="size-7" />
                        ) : (
                          <page.icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{page.label}</CardTitle>
                        <CardDescription>Go to {page.label} page</CardDescription>
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
                  <SelectedLottoComponent />
                </div>
              ) : null
            })()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
