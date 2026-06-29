import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite'
import type { PersistenceAdapter } from '../adapter'
import type {
  AccentColor,
  Category,
  NewCategory,
  NewTask,
  Task,
  TaskPatch,
} from '../models'
import { initialCategories, initialTasks } from '../../data'

const DB_NAME = 'flowly'
const DB_VERSION = 1

interface TaskRow {
  id: string
  title: string
  done: number
  color: string
  category_id: string | null
}

interface CategoryRow {
  id: string
  name: string
  task_count: number
  progress: number
  gradient: string
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    done: row.done === 1,
    color: row.color as AccentColor,
    categoryId: row.category_id ?? null,
  }
}

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    taskCount: row.task_count,
    progress: row.progress,
    gradient: row.gradient,
  }
}

/**
 * Offline-first persistence backed by a local SQLite database.
 * Used on native (iOS / Android) builds through `@capacitor-community/sqlite`.
 */
export class SqliteAdapter implements PersistenceAdapter {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite)
  private db: SQLiteDBConnection | null = null
  private ready: Promise<void> | null = null

  async init(): Promise<void> {
    // Guard against concurrent / repeated initialisation.
    if (!this.ready) this.ready = this.open()
    return this.ready
  }

  private async open(): Promise<void> {
    const consistency = await this.sqlite.checkConnectionsConsistency()
    const isConn = (await this.sqlite.isConnection(DB_NAME, false)).result

    this.db =
      consistency.result && isConn
        ? await this.sqlite.retrieveConnection(DB_NAME, false)
        : await this.sqlite.createConnection(
            DB_NAME,
            false,
            'no-encryption',
            DB_VERSION,
            false,
          )

    await this.db.open()
    await this.createSchema()
    await this.seedIfEmpty()
  }

  private get connection(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error('SqliteAdapter used before init() completed.')
    }
    return this.db
  }

  private async createSchema(): Promise<void> {
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id          TEXT PRIMARY KEY NOT NULL,
        title       TEXT NOT NULL,
        done        INTEGER NOT NULL DEFAULT 0,
        color       TEXT NOT NULL,
        category_id TEXT
      );
      CREATE TABLE IF NOT EXISTS categories (
        id         TEXT PRIMARY KEY NOT NULL,
        name       TEXT NOT NULL,
        task_count INTEGER NOT NULL DEFAULT 0,
        progress   INTEGER NOT NULL DEFAULT 0,
        gradient   TEXT NOT NULL
      );
    `)
  }

  private async seedIfEmpty(): Promise<void> {
    const tasks = await this.connection.query('SELECT COUNT(*) AS count FROM tasks;')
    if ((tasks.values?.[0]?.count ?? 0) === 0) {
      for (const task of initialTasks) {
        await this.connection.run(
          'INSERT INTO tasks (id, title, done, color, category_id) VALUES (?, ?, ?, ?, ?);',
          [task.id, task.title, task.done ? 1 : 0, task.color, task.categoryId],
        )
      }
    }

    const categories = await this.connection.query(
      'SELECT COUNT(*) AS count FROM categories;',
    )
    if ((categories.values?.[0]?.count ?? 0) === 0) {
      for (const category of initialCategories) {
        await this.connection.run(
          'INSERT INTO categories (id, name, task_count, progress, gradient) VALUES (?, ?, ?, ?, ?);',
          [
            category.id,
            category.name,
            category.taskCount,
            category.progress,
            category.gradient,
          ],
        )
      }
    }
  }

  async getTasks(): Promise<Task[]> {
    const result = await this.connection.query('SELECT * FROM tasks ORDER BY rowid DESC;')
    return (result.values as TaskRow[] | undefined ?? []).map(rowToTask)
  }

  async addTask(input: NewTask): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      done: false,
      color: input.color,
      categoryId: input.categoryId ?? null,
    }
    await this.connection.run(
      'INSERT INTO tasks (id, title, done, color, category_id) VALUES (?, ?, ?, ?, ?);',
      [task.id, task.title, 0, task.color, task.categoryId],
    )
    return task
  }

  async updateTask(id: string, patch: TaskPatch): Promise<Task> {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (patch.title !== undefined) {
      fields.push('title = ?')
      values.push(patch.title)
    }
    if (patch.done !== undefined) {
      fields.push('done = ?')
      values.push(patch.done ? 1 : 0)
    }
    if (patch.color !== undefined) {
      fields.push('color = ?')
      values.push(patch.color)
    }
    if (patch.categoryId !== undefined) {
      fields.push('category_id = ?')
      values.push(patch.categoryId ?? null)
    }

    if (fields.length > 0) {
      values.push(id)
      await this.connection.run(
        `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?;`,
        values,
      )
    }

    return this.requireTask(id)
  }

  async toggleTask(id: string): Promise<Task> {
    const current = await this.requireTask(id)
    return this.updateTask(id, { done: !current.done })
  }

  async deleteTask(id: string): Promise<void> {
    await this.connection.run('DELETE FROM tasks WHERE id = ?;', [id])
  }

  async getCategories(): Promise<Category[]> {
    const result = await this.connection.query('SELECT * FROM categories;')
    return (result.values as CategoryRow[] | undefined ?? []).map(rowToCategory)
  }

  async addCategory(input: NewCategory): Promise<Category> {
    const category: Category = {
      id: crypto.randomUUID(),
      name: input.name,
      taskCount: 0,
      progress: 0,
      gradient: input.gradient,
    }
    await this.connection.run(
      'INSERT INTO categories (id, name, task_count, progress, gradient) VALUES (?, ?, ?, ?, ?);',
      [category.id, category.name, 0, 0, category.gradient],
    )
    return category
  }

  private async requireTask(id: string): Promise<Task> {
    const result = await this.connection.query(
      'SELECT * FROM tasks WHERE id = ? LIMIT 1;',
      [id],
    )
    const row = (result.values as TaskRow[] | undefined)?.[0]
    if (!row) throw new Error(`Task ${id} not found.`)
    return rowToTask(row)
  }
}
