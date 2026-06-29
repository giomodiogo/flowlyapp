import type { PersistenceAdapter } from '../adapter'
import type {
  Category,
  CategoryPatch,
  NewCategory,
  NewTask,
  Task,
  TaskPatch,
} from '../models'
import {
  categoryFromDTO,
  categoryToDTO,
  taskFromDTO,
  taskToDTO,
  type CategoryDTO,
  type TaskDTO,
} from './dto'

export interface ApiAdapterOptions {
  /** Base URL of the REST API, e.g. `https://api.flowly.app`. */
  baseUrl: string
  /** Optional bearer token / auth header provider. */
  getAuthToken?: () => string | null | undefined
}

/**
 * Remote persistence backed by an HTTP API. Used on the web build, where data
 * lives on the server rather than on the device.
 */
export class ApiAdapter implements PersistenceAdapter {
  private readonly baseUrl: string
  private readonly getAuthToken?: () => string | null | undefined

  constructor(options: ApiAdapterOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
    this.getAuthToken = options.getAuthToken
  }

  // No connection to warm up; the network client is stateless.
  async init(): Promise<void> {}

  async getTasks(): Promise<Task[]> {
    const dtos = await this.request<TaskDTO[]>('GET', '/tasks')
    return dtos.map(taskFromDTO)
  }

  async addTask(input: NewTask): Promise<Task> {
    const dto = await this.request<TaskDTO>('POST', '/tasks', {
      title: input.title,
      accent: input.color,
      is_completed: false,
      category_id: input.categoryId ?? null,
    })
    return taskFromDTO(dto)
  }

  async updateTask(id: string, patch: TaskPatch): Promise<Task> {
    const dto = await this.request<TaskDTO>(
      'PATCH',
      `/tasks/${encodeURIComponent(id)}`,
      taskToDTO(patch),
    )
    return taskFromDTO(dto)
  }

  async toggleTask(id: string): Promise<Task> {
    const dto = await this.request<TaskDTO>(
      'POST',
      `/tasks/${encodeURIComponent(id)}/toggle`,
    )
    return taskFromDTO(dto)
  }

  async deleteTask(id: string): Promise<void> {
    await this.request<void>('DELETE', `/tasks/${encodeURIComponent(id)}`)
  }

  async reorderTasks(orderedIds: string[]): Promise<void> {
    await this.request<void>('POST', '/tasks/reorder', { ids: orderedIds })
  }

  async getCategories(): Promise<Category[]> {
    const dtos = await this.request<CategoryDTO[]>('GET', '/categories')
    return dtos.map(categoryFromDTO)
  }

  async addCategory(input: NewCategory): Promise<Category> {
    const dto = await this.request<CategoryDTO>(
      'POST',
      '/categories',
      categoryToDTO(input),
    )
    return categoryFromDTO(dto)
  }

  async updateCategory(id: string, patch: CategoryPatch): Promise<Category> {
    const dto = await this.request<CategoryDTO>(
      'PATCH',
      `/categories/${encodeURIComponent(id)}`,
      categoryToDTO(patch),
    )
    return categoryFromDTO(dto)
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request<void>('DELETE', `/categories/${encodeURIComponent(id)}`)
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    await this.request<void>('POST', '/categories/reorder', { ids: orderedIds })
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    const token = this.getAuthToken?.()
    if (token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API ${method} ${path} failed: ${response.status}`)
    }

    if (response.status === 204 || method === 'DELETE') {
      return undefined as T
    }

    return (await response.json()) as T
  }
}
