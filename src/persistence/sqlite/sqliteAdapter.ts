import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite'
import type { PersistenceAdapter } from '../adapter'
import type {
  AccentColor,
  Category,
  CategoryPatch,
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
  position: number
}

interface CategoryRow {
  id: string
  name: string
  task_count: number
  progress: number
  gradient: string
  position: number
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
    await this.migrate()
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
        category_id TEXT,
        position    INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS categories (
        id         TEXT PRIMARY KEY NOT NULL,
        name       TEXT NOT NULL,
        task_count INTEGER NOT NULL DEFAULT 0,
        progress   INTEGER NOT NULL DEFAULT 0,
        gradient   TEXT NOT NULL,
        position   INTEGER NOT NULL DEFAULT 0
      );
    `)
  }

  /** Adds columns that were introduced after the first release, if missing. */
  private async migrate(): Promise<void> {
    await this.addColumnIfMissing('categories')
    await this.addColumnIfMissing('tasks')
  }

  private async addColumnIfMissing(table: 'tasks' | 'categories'): Promise<void> {
    const info = await this.connection.query(`PRAGMA table_info(${table});`)
    const columns = (info.values as { name: string }[] | undefined ?? []).map(
      (c) => c.name,
    )
    if (!columns.includes('position')) {
      await this.connection.execute(
        `ALTER TABLE ${table} ADD COLUMN position INTEGER NOT NULL DEFAULT 0;`,
      )
      // Seed positions from current insertion order for existing rows.
      await this.connection.execute(`UPDATE ${table} SET position = rowid;`)
    }
  }

  private async seedIfEmpty(): Promise<void> {
    const tasks = await this.connection.query('SELECT COUNT(*) AS count FROM tasks;')
    if ((tasks.values?.[0]?.count ?? 0) === 0) {
      for (let index = 0; index < initialTasks.length; index += 1) {
        const task = initialTasks[index]
        await this.connection.run(
          'INSERT INTO tasks (id, title, done, color, category_id, position) VALUES (?, ?, ?, ?, ?, ?);',
          [
            task.id,
            task.title,
            task.done ? 1 : 0,
            task.color,
            task.categoryId,
            index,
          ],
        )
      }
    }

    const categories = await this.connection.query(
      'SELECT COUNT(*) AS count FROM categories;',
    )
    if ((categories.values?.[0]?.count ?? 0) === 0) {
      for (let index = 0; index < initialCategories.length; index += 1) {
        const category = initialCategories[index]
        await this.connection.run(
          'INSERT INTO categories (id, name, task_count, progress, gradient, position) VALUES (?, ?, ?, ?, ?, ?);',
          [
            category.id,
            category.name,
            category.taskCount,
            category.progress,
            category.gradient,
            index,
          ],
        )
      }
    }
  }

  async getTasks(): Promise<Task[]> {
    const result = await this.connection.query(
      'SELECT * FROM tasks ORDER BY position ASC, rowid ASC;',
    )
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
    // New tasks go to the top of the list (lowest position).
    const min = await this.connection.query(
      'SELECT COALESCE(MIN(position), 0) AS min FROM tasks;',
    )
    const position = ((min.values?.[0]?.min as number | undefined) ?? 0) - 1
    await this.connection.run(
      'INSERT INTO tasks (id, title, done, color, category_id, position) VALUES (?, ?, ?, ?, ?, ?);',
      [task.id, task.title, 0, task.color, task.categoryId, position],
    )
    return task
  }

  async reorderTasks(orderedIds: string[]): Promise<void> {
    for (let index = 0; index < orderedIds.length; index += 1) {
      await this.connection.run('UPDATE tasks SET position = ? WHERE id = ?;', [
        index,
        orderedIds[index],
      ])
    }
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
    const result = await this.connection.query(
      'SELECT * FROM categories ORDER BY position ASC, rowid ASC;',
    )
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
    const max = await this.connection.query(
      'SELECT COALESCE(MAX(position), -1) AS max FROM categories;',
    )
    const position = ((max.values?.[0]?.max as number | undefined) ?? -1) + 1
    await this.connection.run(
      'INSERT INTO categories (id, name, task_count, progress, gradient, position) VALUES (?, ?, ?, ?, ?, ?);',
      [category.id, category.name, 0, 0, category.gradient, position],
    )
    return category
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    for (let index = 0; index < orderedIds.length; index += 1) {
      await this.connection.run(
        'UPDATE categories SET position = ? WHERE id = ?;',
        [index, orderedIds[index]],
      )
    }
  }

  async updateCategory(id: string, patch: CategoryPatch): Promise<Category> {
    const fields: string[] = []
    const values: (string | number)[] = []

    if (patch.name !== undefined) {
      fields.push('name = ?')
      values.push(patch.name)
    }
    if (patch.gradient !== undefined) {
      fields.push('gradient = ?')
      values.push(patch.gradient)
    }

    if (fields.length > 0) {
      values.push(id)
      await this.connection.run(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = ?;`,
        values,
      )
    }

    return this.requireCategory(id)
  }

  async deleteCategory(id: string): Promise<void> {
    // Detach tasks first so none point at a missing category.
    await this.connection.run(
      'UPDATE tasks SET category_id = NULL WHERE category_id = ?;',
      [id],
    )
    await this.connection.run('DELETE FROM categories WHERE id = ?;', [id])
  }

  private async requireCategory(id: string): Promise<Category> {
    const result = await this.connection.query(
      'SELECT * FROM categories WHERE id = ? LIMIT 1;',
      [id],
    )
    const row = (result.values as CategoryRow[] | undefined)?.[0]
    if (!row) throw new Error(`Category ${id} not found.`)
    return rowToCategory(row)
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
