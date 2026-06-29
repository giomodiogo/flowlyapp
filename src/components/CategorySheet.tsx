import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { categoryThemes } from './categoryThemes'
import type { Category } from '../types'

export interface CategoryFormInput {
  name: string
  gradient: string
}

interface CategorySheetProps {
  /** When provided, the sheet edits this category; otherwise it creates one. */
  category?: Category | null
  onClose: () => void
  onSubmit: (input: CategoryFormInput) => void
}

export function CategorySheet({ category, onClose, onSubmit }: CategorySheetProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [gradient, setGradient] = useState(
    category?.gradient ?? categoryThemes[0].gradient,
  )

  const isEdit = Boolean(category)

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({ name: trimmed, gradient })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">
            {isEdit ? 'Edit category' : 'New category'}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Category name"
          className="mt-5 w-full rounded-2xl bg-canvas px-4 py-3.5 text-[16px] font-medium text-ink outline-none ring-accent/40 placeholder:text-muted focus:ring-2"
        />

        <div className="mt-5">
          <span className="text-sm font-semibold text-muted">Theme</span>
          <div className="mt-3 flex flex-wrap gap-3">
            {categoryThemes.map((theme) => {
              const selected = theme.gradient === gradient
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setGradient(theme.gradient)}
                  aria-label={`Theme ${theme.id}`}
                  className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${theme.gradient} transition ${
                    selected ? 'ring-2 ring-ink ring-offset-2' : 'opacity-80'
                  }`}
                >
                  {selected && (
                    <Check className="h-4 w-4 text-white" strokeWidth={3.5} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          {isEdit ? 'Save changes' : 'Add category'}
        </button>
      </div>
    </div>
  )
}
