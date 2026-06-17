import { CategoryCard } from '../components/CategoryCard'
import { Header } from '../components/Header'
import { TaskItem } from '../components/TaskItem'
import type { Category, Task } from '../types'

interface HomeProps {
  name: string
  categories: Category[]
  tasks: Task[]
  onToggleTask: (id: string) => void
}

const sectionTitle =
  'text-xs font-bold uppercase tracking-[0.18em] text-muted'

export function Home({ name, categories, tasks, onToggleTask }: HomeProps) {
  return (
    <div className="pb-10">
      <Header name={name} />

      <div className="mt-7 px-6 lg:mt-9 lg:px-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
          {/* Categories — shown first on mobile (matches the design), right rail on desktop */}
          <section className="order-1 mb-7 lg:order-2 lg:mb-0">
            <h2 className={sectionTitle}>Categories</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-1">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>

          {/* Today's tasks — main column on desktop */}
          <section className="order-2 lg:order-1">
            <h2 className={sectionTitle}>Today's tasks</h2>
            <ul className="mt-4 grid gap-3 xl:grid-cols-2">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
              ))}
              {tasks.length === 0 && (
                <li className="rounded-3xl bg-white px-5 py-8 text-center text-sm font-medium text-muted shadow-card">
                  No tasks yet. Tap + to add one.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
