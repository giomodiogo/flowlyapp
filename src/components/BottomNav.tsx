import { Timer } from 'lucide-react'
import type { TabId } from '../types'
import { navItems, type NavItem } from './navItems'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
  onPomodoro: () => void
}

function NavButton({
  id,
  label,
  Icon,
  active,
  onChange,
}: NavItem & { active: TabId; onChange: (tab: TabId) => void }) {
  const isActive = active === id
  return (
    <button
      type="button"
      onClick={() => onChange(id)}
      className={`flex flex-1 flex-col items-center gap-1 py-1 transition ${
        isActive ? 'text-accent' : 'text-muted'
      }`}
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.6 : 2.1} />
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  )
}

export function BottomNav({ active, onChange, onPomodoro }: BottomNavProps) {
  return (
    <nav className="relative bg-white px-4 pb-3 pt-3 shadow-nav lg:hidden">
      {/* Center action button — opens the Pomodoro timer */}
      <button
        type="button"
        onClick={onPomodoro}
        aria-label="Open Pomodoro timer"
        className="absolute -top-7 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full bg-accent text-white shadow-fab transition active:scale-95"
      >
        <Timer className="h-7 w-7" strokeWidth={2.6} />
      </button>

      <div className="flex items-center">
        <div className="flex flex-1 justify-around">
          {navItems.slice(0, 2).map((item) => (
            <NavButton key={item.id} {...item} active={active} onChange={onChange} />
          ))}
        </div>

        {/* Spacer reserved for the FAB */}
        <div className="w-16 shrink-0" aria-hidden />

        <div className="flex flex-1 justify-around">
          {navItems.slice(2).map((item) => (
            <NavButton key={item.id} {...item} active={active} onChange={onChange} />
          ))}
        </div>
      </div>
    </nav>
  )
}
