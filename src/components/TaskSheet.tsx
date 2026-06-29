import { useState } from 'react'
import { X } from 'lucide-react'
import type { AccentColor, Category, Task } from '../types'

export interface TaskFormInput {
  title: string
  color: AccentColor
  categoryId: string | null
}

interface TaskSheetProps {
  /** When provided, the sheet edits this task; otherwise it creates a new one. */
  task?: Task | null
  categories: Category[]
  onClose: () => void
  onSubmit: (input: TaskFormInput) => void
}

const colorChoices: { value: AccentColor; className: string }[] = [
  { value: 'pink', className: 'bg-accent-pink' },
  { value: 'blue', className: 'bg-accent' },
  { value: 'purple', className: 'bg-accent-purple' },
]

export function TaskSheet({ task, categories, onClose, onSubmit }: TaskSheetProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [color, setColor] = useState<AccentColor>(task?.color ?? 'blue')
  const [categoryId, setCategoryId] = useState<string | null>(
    task?.categoryId ?? null,
  )

  const isEdit = Boolean(task)

  const submit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit({ title: trimmed, color, categoryId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-ink transition active:scale-95"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="What needs to be done?"
          className="mt-5 w-full rounded-2xl bg-canvas px-4 py-3.5 text-[16px] font-medium text-ink outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
        />

        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm font-semibold text-muted">Color</span>
          {colorChoices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => setColor(choice.value)}
              aria-label={`Color ${choice.value}`}
              className={`h-7 w-7 rounded-full ${choice.className} transition ${
                color === choice.value
                  ? 'ring-2 ring-ink ring-offset-2'
                  : 'opacity-70'
              }`}
            />
          ))}
        </div>

        {categories.length > 0 && (
          <div className="mt-5">
            <span className="text-sm font-semibold text-muted">Category</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  categoryId === null
                    ? 'bg-accent text-white'
                    : 'bg-canvas text-muted'
                }`}
              >
                None
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    categoryId === category.id
                      ? 'bg-accent text-white'
                      : 'bg-canvas text-muted'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          {isEdit ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </div>
  )
}
