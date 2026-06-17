import type { Category, Task } from './types'

export const initialCategories: Category[] = [
  {
    id: 'business',
    name: 'Business',
    taskCount: 40,
    progress: 62,
    gradient: 'from-accent-pink to-accent-purple',
  },
  {
    id: 'personal',
    name: 'Personal',
    taskCount: 18,
    progress: 45,
    gradient: 'from-accent to-sky-400',
  },
]

export const initialTasks: Task[] = [
  { id: '1', title: 'Daily meeting with team', done: false, color: 'pink' },
  { id: '2', title: 'Pay for rent', done: true, color: 'blue' },
  { id: '3', title: 'Check emails', done: false, color: 'blue' },
  { id: '4', title: 'Lunch with Emma', done: false, color: 'pink' },
  { id: '5', title: 'Meditation', done: false, color: 'purple' },
]
