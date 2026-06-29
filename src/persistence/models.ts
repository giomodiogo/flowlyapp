import type { AccentColor, Category, Task } from '../types'

/** Data required to create a new task. The id/done flag are assigned by the layer. */
export interface NewTask {
  title: string
  color: AccentColor
  categoryId?: string | null
}

/** Mutable fields of a task that callers are allowed to patch. */
export type TaskPatch = Partial<Pick<Task, 'title' | 'done' | 'color' | 'categoryId'>>

/** Data required to create a new category. Stats start at zero. */
export interface NewCategory {
  name: string
  gradient: string
}

/** Editable fields of a category. */
export type CategoryPatch = Partial<Pick<Category, 'name' | 'gradient'>>

export type { AccentColor, Category, Task }

