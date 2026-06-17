import { useMemo, useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { AddTaskSheet } from './components/AddTaskSheet'
import { Home } from './pages/Home'
import { Calendar } from './pages/Calendar'
import { Analytics } from './pages/Analytics'
import { Profile } from './pages/Profile'
import { initialCategories, initialTasks } from './data'
import type { AccentColor, TabId, Task } from './types'

const USER_NAME = 'Joy'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [sheetOpen, setSheetOpen] = useState(false)

  const categories = useMemo(() => initialCategories, [])

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )

  const addTask = (title: string, color: AccentColor) =>
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, color, done: false },
      ...prev,
    ])

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-canvas">
      <Sidebar active={tab} onChange={setTab} onAdd={() => setSheetOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            {tab === 'home' && (
              <Home
                name={USER_NAME}
                categories={categories}
                tasks={tasks}
                onToggleTask={toggleTask}
              />
            )}
            {tab === 'calendar' && <Calendar tasks={tasks} />}
            {tab === 'analytics' && (
              <Analytics tasks={tasks} categories={categories} />
            )}
            {tab === 'profile' && <Profile name={USER_NAME} />}
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} onAdd={() => setSheetOpen(true)} />
      </div>

      <AddTaskSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addTask}
      />
    </div>
  )
}
