import { LayoutGrid, Info, Home } from 'lucide-react'

export const PAGES = [
  { id: '6-4-9-12', label: '6-4-9 (12)', icon: LayoutGrid },
  { id: '6-4-10-20', label: '6-4-10 (20)', icon: LayoutGrid },
  { id: '6-4-11-33', label: '6-4-11 (33)', icon: LayoutGrid },
  { id: '6-4-12-48', label: '6-4-12 (48)', icon: LayoutGrid },
  { id: '6-5-8-12', label: '6-5-8 (12)', icon: LayoutGrid },
  { id: '6-5-9-30', label: '6-5-9 (30)', icon: LayoutGrid },
  { id: '6-5-10-50', label: '6-5-10 (50)', icon: LayoutGrid },
  { id: '7-5-8-6', label: '7-5-8 (6)', icon: LayoutGrid },
  { id: '7-5-9-9', label: '7-5-9 (9)', icon: LayoutGrid },
  { id: '7-5-10-21', label: '7-5-10 (21)', icon: LayoutGrid },
  { id: '7-5-11-36', label: '7-5-11 (36)', icon: LayoutGrid },
  { id: 'about', label: 'About', icon: Info },
]

export const SIDEBAR_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  ...PAGES,
]

