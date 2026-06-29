import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { categoryThemes } from './categoryThemes'

interface NewCategoryInput {
  name: string
  gradient: string
}

interface AddCategorySheetProps {
  open: boolean
  onClose: () => void
  onAdd: (input: NewCategoryInput) => void
}

export function AddCategorySheet({ open, onClose, onAdd }: AddCategorySheetProps) {
  const [name, setName] = useState('')
  const [gradient, setGradient] = useState(categoryThemes[0].gradient)

  if (!open) return null

  const reset = () => {
    setName('')
    setGradient(categoryThemes[0].gradient)
  }

  const close = () => {
    reset()
    onClose()
  }

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd({ name: trimmed, gradient })
    close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">New category</h2>
          <button
            type="button"
            onClick={close}
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
          Add category
        </button>
      </div>
    </div>
  )
}
