export type AccentColor = 'pink' | 'blue' | 'purple'

export interface Task {
  id: string
  title: string
  done: boolean
  color: AccentColor
  /** Category this task belongs to, or null when uncategorised. */
  categoryId: string | null
}

export interface Category {
  id: string
  name: string
  taskCount: number
  /** 0–100 completion used by the progress bar. */
  progress: number
  gradient: string
}

export type TabId = 'home' | 'calendar' | 'analytics' | 'profile'
