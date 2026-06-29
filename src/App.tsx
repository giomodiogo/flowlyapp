import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { AddTaskSheet } from './components/AddTaskSheet'
import { AddCategorySheet } from './components/AddCategorySheet'
import { Home } from './pages/Home'
import { Calendar } from './pages/Calendar'
import { Analytics } from './pages/Analytics'
import { Profile } from './pages/Profile'
import { usePersistence } from './persistence'
import type { AccentColor, TabId } from './types'

const USER_NAME = 'Joy'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [taskSheetOpen, setTaskSheetOpen] = useState(false)
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)

  const { tasks, categories, toggleTask, addTask, addCategory } = usePersistence()

  const handleToggleTask = (id: string) => void toggleTask(id)

  const handleAddTask = (input: {
    title: string
    color: AccentColor
    categoryId: string | null
  }) => void addTask(input)

  const handleAddCategory = (input: { name: string; gradient: string }) =>
    void addCategory(input)

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-canvas">
      <Sidebar active={tab} onChange={setTab} onAdd={() => setTaskSheetOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            {tab === 'home' && (
              <Home
                name={USER_NAME}
                categories={categories}
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddCategory={() => setCategorySheetOpen(true)}
              />
            )}
            {tab === 'calendar' && <Calendar tasks={tasks} />}
            {tab === 'analytics' && (
              <Analytics tasks={tasks} categories={categories} />
            )}
            {tab === 'profile' && <Profile name={USER_NAME} />}
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} onAdd={() => setTaskSheetOpen(true)} />
      </div>

      <AddTaskSheet
        open={taskSheetOpen}
        categories={categories}
        onClose={() => setTaskSheetOpen(false)}
        onAdd={handleAddTask}
      />

      <AddCategorySheet
        open={categorySheetOpen}
        onClose={() => setCategorySheetOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  )
}
