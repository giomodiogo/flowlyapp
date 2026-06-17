import { useState } from 'react'
import { X } from 'lucide-react'
import type { AccentColor } from '../types'

interface AddTaskSheetProps {
  open: boolean
  onClose: () => void
  onAdd: (title: string, color: AccentColor) => void
}

const colorChoices: { value: AccentColor; className: string }[] = [
  { value: 'pink', className: 'bg-accent-pink' },
  { value: 'blue', className: 'bg-accent' },
  { value: 'purple', className: 'bg-accent-purple' },
]

export function AddTaskSheet({ open, onClose, onAdd }: AddTaskSheetProps) {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState<AccentColor>('blue')

  if (!open) return null

  const reset = () => {
    setTitle('')
    setColor('blue')
  }

  const close = () => {
    reset()
    onClose()
  }

  const submit = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed, color)
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
          <h2 className="text-xl font-bold text-ink">New task</h2>
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

        <button
          type="button"
          onClick={submit}
          disabled={!title.trim()}
          className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          Add task
        </button>
      </div>
    </div>
  )
}
