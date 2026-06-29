import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { CategoryMenu } from '../components/CategoryMenu'
import { Header } from '../components/Header'
import { TaskItem } from '../components/TaskItem'
import type { Category, Task } from '../types'

interface HomeProps {
  name: string
  categories: Category[]
  tasks: Task[]
  onToggleTask: (id: string) => void
  onAddCategory: () => void
  onAddTask: () => void
}

const sectionTitle =
  'text-xs font-bold uppercase tracking-[0.18em] text-muted'

export function Home({
  name,
  categories,
  tasks,
  onToggleTask,
  onAddCategory,
  onAddTask,
}: HomeProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const visibleTasks = useMemo(
    () =>
      selectedCategoryId === null
        ? tasks
        : tasks.filter((task) => task.categoryId === selectedCategoryId),
    [tasks, selectedCategoryId],
  )

  const activeCategory = categories.find((c) => c.id === selectedCategoryId)

  return (
    <div className="pb-10">
      <Header name={name} />

      <div className="mt-7 px-6 lg:mt-9 lg:px-10">
        <section>
          <h2 className={sectionTitle}>Categories</h2>
          <div className="mt-4">
            <CategoryMenu
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              onAdd={onAddCategory}
            />
          </div>
        </section>

        <section className="mt-7">
          <h2 className={sectionTitle}>
            {activeCategory ? `${activeCategory.name} tasks` : "Today's tasks"}
          </h2>
          <ul className="mt-4 grid gap-3 xl:grid-cols-2">
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
            ))}
            {visibleTasks.length === 0 && (
              <li className="rounded-3xl bg-white px-5 py-8 text-center text-sm font-medium text-muted shadow-card">
                {selectedCategoryId === null
                  ? 'No tasks yet. Tap + to add one.'
                  : 'No tasks in this category yet.'}
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* Floating action button to add a task */}
      <button
        type="button"
        onClick={onAddTask}
        aria-label="Add task"
        className="fixed bottom-24 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-fab transition active:scale-95 lg:bottom-10 lg:right-10 lg:h-16 lg:w-16"
      >
        <Plus className="h-7 w-7" strokeWidth={2.6} />
      </button>
    </div>
  )
}
