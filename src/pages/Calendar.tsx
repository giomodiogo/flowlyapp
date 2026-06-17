import type { Task } from '../types'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarProps {
  tasks: Task[]
}

export function Calendar({ tasks }: CalendarProps) {
  const today = new Date()
  const todayIndex = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - todayIndex)

  return (
    <div className="px-6 pb-10 pt-7 lg:px-10 lg:pt-9">
      <h1 className="text-3xl font-extrabold tracking-tight">Calendar</h1>
      <p className="mt-1 text-sm font-medium text-muted">
        {today.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {weekDays.map((label, i) => {
          const date = new Date(monday)
          date.setDate(monday.getDate() + i)
          const isToday = i === todayIndex
          return (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 rounded-2xl py-3 transition ${
                isToday ? 'bg-accent text-white shadow-fab' : 'bg-white text-ink shadow-card'
              }`}
            >
              <span
                className={`text-[11px] font-semibold ${
                  isToday ? 'text-white/80' : 'text-muted'
                }`}
              >
                {label}
              </span>
              <span className="text-base font-bold">{date.getDate()}</span>
            </div>
          )
        })}
      </div>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-muted">
        Scheduled
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-4 rounded-3xl bg-white px-5 py-4 shadow-card"
          >
            <span className="h-10 w-1.5 rounded-full bg-accent" />
            <div>
              <p className="text-[16px] font-bold text-ink">{task.title}</p>
              <p className="text-xs font-medium text-muted">
                {task.done ? 'Completed' : 'Pending'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
