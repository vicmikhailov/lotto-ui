import { LayoutGrid, Info, Home } from 'lucide-react'
import type { PageConfig } from '@/types'
import Lotto649 from '@/components/Lotto649'
import Lotto6410 from '@/components/Lotto6410'
import Lotto6411 from '@/components/Lotto6411'
import Lotto6412 from '@/components/Lotto6412'
import Lotto658 from '@/components/Lotto658'
import Lotto659 from '@/components/Lotto659'
import Lotto6510 from '@/components/Lotto6510'
import Lotto758 from '@/components/Lotto758'
import Lotto759 from '@/components/Lotto759'
import Lotto7510 from '@/components/Lotto7510'
import Lotto7511 from '@/components/Lotto7511'

/**
 * Array of available lotto pages
 */
export const PAGES: PageConfig[] = [
  // 64x Series - Pick 6 from Pool of 4 Options (Compact Coverage)
  { id: '6-4-9-12', label: '6-4-9 (12)', name: 'Compact Cover', icon: LayoutGrid, category: '64x' },
  { id: '6-4-10-20', label: '6-4-10 (20)', name: 'Balanced Play', icon: LayoutGrid, category: '64x' },
  { id: '6-4-11-33', label: '6-4-11 (33)', name: 'Extended Range', icon: LayoutGrid, category: '64x' },
  { id: '6-4-12-48', label: '6-4-12 (48)', name: 'Full Spectrum', icon: LayoutGrid, category: '64x' },

  // 65x Series - Pick 6 from Pool of 5 Options (Extended Coverage)
  { id: '6-5-8-12', label: '6-5-8 (12)', name: 'Precision Select', icon: LayoutGrid, category: '65x' },
  { id: '6-5-9-30', label: '6-5-9 (30)', name: 'Classic Cover', icon: LayoutGrid, category: '65x' },
  { id: '6-5-10-50', label: '6-5-10 (50)', name: 'Premium Range', icon: LayoutGrid, category: '65x' },

  // 75x Series - Pick 7 from Pool of 5 Options (Maximum Coverage)
  { id: '7-5-8-6', label: '7-5-8 (6)', name: 'Quick Strike', icon: LayoutGrid, category: '75x' },
  { id: '7-5-9-9', label: '7-5-9 (9)', name: 'Core Coverage', icon: LayoutGrid, category: '75x' },
  { id: '7-5-10-21', label: '7-5-10 (21)', name: 'Advanced Play', icon: LayoutGrid, category: '75x' },
  { id: '7-5-11-36', label: '7-5-11 (36)', name: 'Master Cover', icon: LayoutGrid, category: '75x' },

  { id: 'about', label: 'About', icon: Info, category: 'info' },
]

/**
 * Array of sidebar navigation items
 */
export const SIDEBAR_ITEMS: PageConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  ...PAGES,
]

/**
 * Map of page IDs to Lotto components for dynamic rendering
 */
export const LOTTO_COMPONENTS: Record<string, React.ComponentType> = {
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
