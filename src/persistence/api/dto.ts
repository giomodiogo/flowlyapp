import type {
  AccentColor,
  Category,
  CategoryPatch,
  NewCategory,
  Task,
} from '../models'

/**
 * Wire formats returned by the remote API. These intentionally differ from the
 * app's domain models (snake_case, different field names) — the mappers below
 * isolate the rest of the codebase from the backend's shape.
 */
export interface TaskDTO {
  id: string
  title: string
  is_completed: boolean
  accent: string
  category_id: string | null
}

export interface CategoryDTO {
  id: string
  label: string
  total_tasks: number
  completion: number
  theme: string
}

const ACCENTS: AccentColor[] = ['pink', 'blue', 'purple']

function toAccent(value: string): AccentColor {
  return (ACCENTS as string[]).includes(value) ? (value as AccentColor) : 'blue'
}

export function taskFromDTO(dto: TaskDTO): Task {
  return {
    id: dto.id,
    title: dto.title,
    done: dto.is_completed,
    color: toAccent(dto.accent),
    categoryId: dto.category_id ?? null,
  }
}

export function taskToDTO(task: Partial<Task>): Partial<TaskDTO> {
  const dto: Partial<TaskDTO> = {}
  if (task.id !== undefined) dto.id = task.id
  if (task.title !== undefined) dto.title = task.title
  if (task.done !== undefined) dto.is_completed = task.done
  if (task.color !== undefined) dto.accent = task.color
  if (task.categoryId !== undefined) dto.category_id = task.categoryId
  return dto
}

export function categoryToDTO(
  category: NewCategory | CategoryPatch,
): Partial<CategoryDTO> {
  const dto: Partial<CategoryDTO> = {}
  if (category.name !== undefined) dto.label = category.name
  if (category.gradient !== undefined) dto.theme = category.gradient
  return dto
}

export function categoryFromDTO(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.label,
    taskCount: dto.total_tasks,
    progress: dto.completion,
    gradient: dto.theme,
  }
}
