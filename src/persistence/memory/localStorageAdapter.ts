import type { PersistenceAdapter } from '../adapter'
import type {
  Category,
  CategoryPatch,
  NewCategory,
  NewTask,
  Task,
  TaskPatch,
} from '../models'
import { initialCategories, initialTasks } from '../../data'

const TASKS_KEY = 'flowly.tasks'
const CATEGORIES_KEY = 'flowly.categories'

/**
 * `localStorage`-backed fallback used for web development when no API URL is
 * configured. It keeps the app fully functional without a backend, while still
 * speaking the same `PersistenceAdapter` contract as the real adapters.
 */
export class LocalStorageAdapter implements PersistenceAdapter {
  async init(): Promise<void> {
    if (this.read<Task[]>(TASKS_KEY) === null) {
      this.write(TASKS_KEY, initialTasks)
    }
    if (this.read<Category[]>(CATEGORIES_KEY) === null) {
      this.write(CATEGORIES_KEY, initialCategories)
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.read<Task[]>(TASKS_KEY) ?? []
  }

  async addTask(input: NewTask): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      done: false,
      color: input.color,
      categoryId: input.categoryId ?? null,
    }
    const tasks = await this.getTasks()
    this.write(TASKS_KEY, [task, ...tasks])
    return task
  }

  async updateTask(id: string, patch: TaskPatch): Promise<Task> {
    const tasks = await this.getTasks()
    let updated: Task | undefined
    const next = tasks.map((task) => {
      if (task.id !== id) return task
      updated = { ...task, ...patch }
      return updated
    })
    if (!updated) throw new Error(`Task ${id} not found.`)
    this.write(TASKS_KEY, next)
    return updated
  }

  async toggleTask(id: string): Promise<Task> {
    const tasks = await this.getTasks()
    const current = tasks.find((task) => task.id === id)
    if (!current) throw new Error(`Task ${id} not found.`)
    return this.updateTask(id, { done: !current.done })
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks()
    this.write(
      TASKS_KEY,
      tasks.filter((task) => task.id !== id),
    )
  }

  async reorderTasks(orderedIds: string[]): Promise<void> {
    const tasks = await this.getTasks()
    const byId = new Map(tasks.map((task) => [task.id, task]))
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((task): task is Task => task !== undefined)
    for (const task of tasks) {
      if (!orderedIds.includes(task.id)) ordered.push(task)
    }
    this.write(TASKS_KEY, ordered)
  }

  async getCategories(): Promise<Category[]> {
    return this.read<Category[]>(CATEGORIES_KEY) ?? []
  }

  async addCategory(input: NewCategory): Promise<Category> {
    const category: Category = {
      id: crypto.randomUUID(),
      name: input.name,
      taskCount: 0,
      progress: 0,
      gradient: input.gradient,
    }
    const categories = await this.getCategories()
    this.write(CATEGORIES_KEY, [...categories, category])
    return category
  }

  async updateCategory(id: string, patch: CategoryPatch): Promise<Category> {
    const categories = await this.getCategories()
    let updated: Category | undefined
    const next = categories.map((category) => {
      if (category.id !== id) return category
      updated = { ...category, ...patch }
      return updated
    })
    if (!updated) throw new Error(`Category ${id} not found.`)
    this.write(CATEGORIES_KEY, next)
    return updated
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = await this.getCategories()
    this.write(
      CATEGORIES_KEY,
      categories.filter((category) => category.id !== id),
    )

    // Detach tasks that referenced the removed category.
    const tasks = await this.getTasks()
    this.write(
      TASKS_KEY,
      tasks.map((task) =>
        task.categoryId === id ? { ...task, categoryId: null } : task,
      ),
    )
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    const categories = await this.getCategories()
    const byId = new Map(categories.map((category) => [category.id, category]))
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((category): category is Category => category !== undefined)
    // Keep any category that wasn't part of the requested order.
    for (const category of categories) {
      if (!orderedIds.includes(category.id)) ordered.push(category)
    }
    this.write(CATEGORIES_KEY, ordered)
  }

  private read<T>(key: string): T | null {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  private write(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
