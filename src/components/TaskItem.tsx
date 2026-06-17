import { Check } from 'lucide-react'
import type { AccentColor, Task } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
}

const ringColor: Record<AccentColor, string> = {
  pink: 'border-accent-pink text-accent-pink',
  blue: 'border-accent text-accent',
  purple: 'border-accent-purple text-accent-purple',
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className="flex w-full items-center gap-4 rounded-3xl bg-white px-5 py-4 text-left shadow-card transition active:scale-[0.99]"
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
          className={`text-[17px] font-bold transition ${
            task.done ? 'text-muted line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </span>
      </button>
    </li>
  )
}
