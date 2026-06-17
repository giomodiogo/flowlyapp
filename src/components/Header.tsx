import { Bell, Menu, Search } from 'lucide-react'

interface HeaderProps {
  name: string
  onMenu?: () => void
  onSearch?: () => void
  onNotifications?: () => void
}

export function Header({ name, onMenu, onSearch, onNotifications }: HeaderProps) {
  return (
    <header className="px-6 pt-6 lg:px-10 lg:pt-9">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="-ml-1 grid h-10 w-10 place-items-center rounded-xl text-ink transition active:scale-95 lg:hidden"
        >
          <Menu className="h-6 w-6" strokeWidth={2.4} />
        </button>

        <div className="hidden lg:block" aria-hidden />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink transition active:scale-95"
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={onNotifications}
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink transition active:scale-95"
          >
            <Bell className="h-[22px] w-[22px]" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <h1 className="mt-3 text-[32px] font-extrabold leading-tight tracking-tight lg:text-[40px]">
        What's up, {name}!
      </h1>
    </header>
  )
}
