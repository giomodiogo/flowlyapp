import type {
  Category,
  CategoryPatch,
  NewCategory,
  NewTask,
  Task,
  TaskPatch,
} from './models'

/**
 * Storage-agnostic contract for everything the app needs to persist.
 *
 * Each platform provides its own implementation:
 *  - mobile  → local SQLite database (offline-first)
 *  - web     → remote HTTP API
 *
 * The rest of the app only ever talks to this interface, so swapping the
 * backing store never leaks into the UI.
 */
export interface PersistenceAdapter {
  /** Prepares the backing store (opens the DB, warms the client, seeds data…). */
  init(): Promise<void>

  getTasks(): Promise<Task[]>
  addTask(input: NewTask): Promise<Task>
  updateTask(id: string, patch: TaskPatch): Promise<Task>
  toggleTask(id: string): Promise<Task>
  deleteTask(id: string): Promise<void>
  /** Persists a new ordering for the tasks, given their ids in order. */
  reorderTasks(orderedIds: string[]): Promise<void>

  getCategories(): Promise<Category[]>
  addCategory(input: NewCategory): Promise<Category>
  updateCategory(id: string, patch: CategoryPatch): Promise<Category>
  /**
   * Removes a category. Tasks that referenced it become uncategorised
   * (their `categoryId` is set to null).
   */
  deleteCategory(id: string): Promise<void>
  /** Persists a new ordering for the categories, given their ids in order. */
  reorderCategories(orderedIds: string[]): Promise<void>
}
