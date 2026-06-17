import type { Category, Task } from '../types'

interface AnalyticsProps {
  tasks: Task[]
  categories: Category[]
}

function Ring({ percent }: { percent: number }) {
  const size = 140
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#eef1f8"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2f6bff"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

export function Analytics({ tasks, categories }: AnalyticsProps) {
  const completed = tasks.filter((t) => t.done).length
  const total = tasks.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="px-6 pb-10 pt-7 lg:max-w-3xl lg:px-10 lg:pt-9">
      <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm font-medium text-muted">Your productivity overview</p>

      <div className="mt-6 flex flex-col items-center rounded-3xl bg-white p-6 shadow-card">
        <div className="relative grid place-items-center">
          <Ring percent={percent} />
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-ink">{percent}%</span>
            <span className="text-xs font-semibold text-muted">Completed</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-muted">
          {completed} of {total} tasks done today
        </p>
      </div>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-muted">
        By category
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-ink">{category.name}</span>
              <span className="text-sm font-semibold text-muted">
                {category.progress}%
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`}
                style={{ width: `${category.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
