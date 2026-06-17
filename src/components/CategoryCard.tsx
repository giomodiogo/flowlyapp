import type { Category } from '../types'

interface CategoryCardProps {
  category: Category
  onClick?: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col rounded-3xl bg-white p-5 text-left shadow-card transition active:scale-[0.98]"
    >
      <span className="text-sm font-medium text-muted">
        {category.taskCount} tasks
      </span>
      <span className="mt-1 text-xl font-bold text-ink">{category.name}</span>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`}
          style={{ width: `${category.progress}%` }}
        />
      </div>
    </button>
  )
}
