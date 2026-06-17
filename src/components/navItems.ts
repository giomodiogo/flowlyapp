import { CalendarDays, Home, PieChart, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TabId } from '../types'

export interface NavItem {
  id: TabId
  label: string
  Icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', Icon: PieChart },
  { id: 'profile', label: 'Profile', Icon: User },
]
