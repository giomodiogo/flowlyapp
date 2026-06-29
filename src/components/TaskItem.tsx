import { Check, GripVertical, Pencil, Trash2 } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { AccentColor, Task } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onDragStart: (event: ReactPointerEvent, id: string) => void
  dragging: boolean
}

const ringColor: Record<AccentColor, string> = {
  pink: 'border-accent-pink text-accent-pink',
  blue: 'border-accent text-accent',
  purple: 'border-accent-purple text-accent-purple',
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  dragging,
}: TaskItemProps) {
  return (
    <li
      data-sort-id={task.id}
      className={`flex items-center gap-2 rounded-3xl bg-white px-3 py-4 shadow-card transition ${
        dragging ? 'scale-[1.02] ring-2 ring-accent' : ''
      }`}
    >
      <button
        type="button"
        onPointerDown={(e) => onDragStart(e, task.id)}
        aria-label="Reorder task"
        className="grid h-9 w-6 shrink-0 cursor-grab touch-none place-items-center text-muted active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left transition active:scale-[0.99]"
      >
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-[2.5px] transition ${
            task.done
              ? 'border-accent bg-accent text-white'
              : `${ringColor[task.color]} bg-transparent`
          }`}
        >
          {task.done && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
        </span>

        <span
          className={`truncate text-[17px] font-bold transition ${
            task.done ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label="Edit task"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-muted transition active:scale-95 hover:text-ink"
      >
        <Pencil className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label="Delete task"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-muted transition active:scale-95 hover:text-accent-pink"
      >
        <Trash2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </button>
    </li>
  )
}
