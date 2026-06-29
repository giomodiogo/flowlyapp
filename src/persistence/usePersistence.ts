import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  Category,
  CategoryPatch,
  NewCategory,
  NewTask,
  Task,
  TaskPatch,
} from './models'
import { persistence } from './createPersistence'

interface PersistenceState {
  tasks: Task[]
  categories: Category[]
  loading: boolean
  error: Error | null
  addTask: (input: NewTask) => Promise<void>
  updateTask: (id: string, patch: TaskPatch) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (orderedIds: string[]) => Promise<void>
  addCategory: (input: NewCategory) => Promise<void>
  updateCategory: (id: string, patch: CategoryPatch) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  reorderCategories: (orderedIds: string[]) => Promise<void>
  reload: () => Promise<void>
}

/** Recomputes each category's task count and completion from the live tasks. */
function withStats(categories: Category[], tasks: Task[]): Category[] {
  return categories.map((category) => {
    const owned = tasks.filter((task) => task.categoryId === category.id)
    const done = owned.filter((task) => task.done).length
    return {
      ...category,
      taskCount: owned.length,
      progress: owned.length === 0 ? 0 : Math.round((done / owned.length) * 100),
    }
  })
}

/**
 * React entry point into the persistence layer. Loads data through the
 * platform-appropriate adapter and exposes optimistic mutators to the UI.
 */
export function usePersistence(): PersistenceState {
  const [tasks, setTasks] = useState<Task[]>([])
  const [rawCategories, setRawCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Stored categories keep name/gradient; counts always reflect the live tasks.
  const categories = useMemo(
    () => withStats(rawCategories, tasks),
    [rawCategories, tasks],
  )

  const reload = useCallback(async () => {
    const [nextTasks, nextCategories] = await Promise.all([
      persistence.getTasks(),
      persistence.getCategories(),
    ])
    setTasks(nextTasks)
    setRawCategories(nextCategories)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await persistence.init()
        if (cancelled) return
        await reload()
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [reload])

  const addTask = useCallback(async (input: NewTask) => {
    const created = await persistence.addTask(input)
    setTasks((prev) => [created, ...prev])
  }, [])

  const updateTask = useCallback(async (id: string, patch: TaskPatch) => {
    const updated = await persistence.updateTask(id, patch)
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
  }, [])

  const toggleTask = useCallback(async (id: string) => {
    // Optimistic flip, then reconcile with what the adapter returns.
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
    try {
      const updated = await persistence.toggleTask(id)
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
    } catch (err) {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
      )
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await persistence.deleteTask(id)
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const reorderTasks = useCallback(async (orderedIds: string[]) => {
    setTasks((prev) => {
      const byId = new Map(prev.map((task) => [task.id, task]))
      const ordered = orderedIds
        .map((id) => byId.get(id))
        .filter((task): task is Task => task !== undefined)
      for (const task of prev) {
        if (!orderedIds.includes(task.id)) ordered.push(task)
      }
      return ordered
    })
    await persistence.reorderTasks(orderedIds)
  }, [])

  const addCategory = useCallback(async (input: NewCategory) => {
    const created = await persistence.addCategory(input)
    setRawCategories((prev) => [...prev, created])
  }, [])

  const updateCategory = useCallback(async (id: string, patch: CategoryPatch) => {
    const updated = await persistence.updateCategory(id, patch)
    setRawCategories((prev) =>
      prev.map((category) => (category.id === id ? updated : category)),
    )
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    await persistence.deleteCategory(id)
    setRawCategories((prev) => prev.filter((category) => category.id !== id))
    // Mirror the adapter's cascade: detach affected tasks locally.
    setTasks((prev) =>
      prev.map((task) =>
        task.categoryId === id ? { ...task, categoryId: null } : task,
      ),
    )
  }, [])

  const reorderCategories = useCallback(async (orderedIds: string[]) => {
    // Optimistically apply the new order, then persist.
    setRawCategories((prev) => {
      const byId = new Map(prev.map((category) => [category.id, category]))
      const ordered = orderedIds
        .map((id) => byId.get(id))
        .filter((category): category is Category => category !== undefined)
      for (const category of prev) {
        if (!orderedIds.includes(category.id)) ordered.push(category)
      }
      return ordered
    })
    await persistence.reorderCategories(orderedIds)
  }, [])

  return {
    tasks,
    categories,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    reload,
  }
}
