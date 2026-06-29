import { Timer } from 'lucide-react'
import type { TabId } from '../types'
import { navItems } from './navItems'

interface SidebarProps {
  active: TabId
  onChange: (tab: TabId) => void
  onPomodoro: () => void
}

export function Sidebar({ active, onChange, onPomodoro }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/70 bg-white px-5 py-7 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple text-base font-extrabold text-white">
          F
        </span>
        <span className="text-xl font-extrabold tracking-tight">Flowly</span>
      </div>

      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition ${
                isActive
                  ? 'bg-accent text-white shadow-fab'
                  : 'text-muted hover:bg-canvas hover:text-ink'
              }`}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.6 : 2.2}
              />
              {label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onPomodoro}
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-[15px] font-bold text-white shadow-fab transition hover:brightness-105 active:scale-[0.98]"
      >
        <Timer className="h-5 w-5" strokeWidth={2.6} />
        Pomodoro
      </button>
    </aside>
  )
}
