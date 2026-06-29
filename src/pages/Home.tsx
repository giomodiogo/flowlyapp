import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { CategoryMenu } from '../components/CategoryMenu'
import { Header } from '../components/Header'
import { TaskItem } from '../components/TaskItem'
import { useSortable } from '../components/useSortable'
import type { Category, Task } from '../types'

interface HomeProps {
  name: string
  categories: Category[]
  tasks: Task[]
  onToggleTask: (id: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
  onReorderTasks: (orderedIds: string[]) => void
  onManageCategories: () => void
  onAddTask: () => void
}

const sectionTitle =
  'text-xs font-bold uppercase tracking-[0.18em] text-muted'

export function Home({
  name,
  categories,
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
  onManageCategories,
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

  // When a filter is active, splice the reordered visible tasks back into the
  // full list so hidden tasks keep their place.
  const handleReorderVisible = (visibleOrderedIds: string[]) => {
    if (selectedCategoryId === null) {
      onReorderTasks(visibleOrderedIds)
      return
    }
    const visibleIds = new Set(visibleTasks.map((t) => t.id))
    let cursor = 0
    const fullOrder = tasks.map((task) => {
      if (!visibleIds.has(task.id)) return task.id
      const id = visibleOrderedIds[cursor]
      cursor += 1
      return id
    })
    onReorderTasks(fullOrder)
  }

  const {
    list: orderedTasks,
    dragId,
    start: startTaskDrag,
  } = useSortable(visibleTasks, handleReorderVisible)

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
              onManage={onManageCategories}
            />
          </div>
        </section>

        <section className="mt-7">
          <h2 className={sectionTitle}>
            {activeCategory ? `${activeCategory.name} tasks` : "Today's tasks"}
          </h2>
          <ul className="mt-4 grid gap-3">
            {orderedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onDragStart={startTaskDrag}
                dragging={dragId === task.id}
              />
            ))}
            {orderedTasks.length === 0 && (
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
