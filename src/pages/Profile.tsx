import { Bell, ChevronRight, LogOut, Settings, Shield, User } from 'lucide-react'

interface ProfileProps {
  name: string
}

const menu = [
  { label: 'Account settings', Icon: Settings },
  { label: 'Notifications', Icon: Bell },
  { label: 'Privacy & security', Icon: Shield },
]

export function Profile({ name }: ProfileProps) {
  return (
    <div className="px-6 pb-10 pt-7 lg:max-w-2xl lg:px-10 lg:pt-9">
      <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>

      <div className="mt-6 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent-pink to-accent-purple text-white">
          <User className="h-8 w-8" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-lg font-bold text-ink">{name}</p>
          <p className="text-sm font-medium text-muted">joy@flowly.app</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {menu.map(({ label, Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center gap-4 rounded-3xl bg-white px-5 py-4 text-left shadow-card transition active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-canvas text-accent">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex-1 text-[16px] font-bold text-ink">{label}</span>
            <ChevronRight className="h-5 w-5 text-muted" strokeWidth={2.2} />
          </button>
        ))}

        <button
          type="button"
          className="mt-2 flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-4 text-[16px] font-bold text-accent-pink shadow-card transition active:scale-[0.99]"
        >
          <LogOut className="h-5 w-5" strokeWidth={2.2} />
          Log out
        </button>
      </div>
    </div>
  )
}
