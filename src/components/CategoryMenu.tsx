import { SlidersHorizontal } from 'lucide-react'
import type { Category } from '../types'

interface CategoryMenuProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onManage: () => void
}

const chipBase =
  'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition active:scale-95'

export function CategoryMenu({
  categories,
  selectedId,
  onSelect,
  onManage,
}: CategoryMenuProps) {
  return (
    <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${chipBase} ${
          selectedId === null
            ? 'bg-accent text-white shadow-fab'
            : 'bg-white text-muted shadow-card'
        }`}
      >
        All
      </button>

      {categories.map((category) => {
        const active = selectedId === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`${chipBase} flex items-center gap-2 ${
              active
                ? 'bg-accent text-white shadow-fab'
                : 'bg-white text-muted shadow-card'
            }`}
          >
            {category.name}
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold ${
                active ? 'bg-white/25 text-white' : 'bg-canvas text-muted'
              }`}
            >
              {category.taskCount}
            </span>
          </button>
        )
      })}

      <button
        type="button"
        onClick={onManage}
        aria-label="Manage categories"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-accent shadow-card transition active:scale-95"
      >
        <SlidersHorizontal className="h-5 w-5" strokeWidth={2.4} />
      </button>
    </div>
  )
}
