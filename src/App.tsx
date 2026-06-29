import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { Sidebar } from './components/Sidebar'
import { TaskSheet, type TaskFormInput } from './components/TaskSheet'
import { ManageCategories } from './components/ManageCategories'
import type { CategoryFormInput } from './components/CategorySheet'
import { ConfirmDialog } from './components/ConfirmDialog'
import { PomodoroTimer } from './components/PomodoroTimer'
import { Home } from './pages/Home'
import { Calendar } from './pages/Calendar'
import { Analytics } from './pages/Analytics'
import { Profile } from './pages/Profile'
import { usePersistence } from './persistence'
import type { TabId, Task } from './types'

const USER_NAME = 'Joy'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [taskSheetOpen, setTaskSheetOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false)
  const [pomodoroOpen, setPomodoroOpen] = useState(false)

  const {
    tasks,
    categories,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = usePersistence()

  const handleToggleTask = (id: string) => void toggleTask(id)

  const openAddTask = () => {
    setEditingTask(null)
    setTaskSheetOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskSheetOpen(true)
  }

  const handleSubmitTask = (input: TaskFormInput) => {
    if (editingTask) {
      void updateTask(editingTask.id, input)
    } else {
      void addTask(input)
    }
  }

  const confirmDeleteTask = () => {
    if (deletingTask) void deleteTask(deletingTask.id)
    setDeletingTask(null)
  }

  const handleAddCategory = (input: CategoryFormInput) => void addCategory(input)

  const handleUpdateCategory = (id: string, patch: CategoryFormInput) =>
    void updateCategory(id, patch)

  const handleDeleteCategory = (id: string) => void deleteCategory(id)

  const handleReorderCategories = (orderedIds: string[]) =>
    void reorderCategories(orderedIds)

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-canvas">
      <Sidebar active={tab} onChange={setTab} onPomodoro={() => setPomodoroOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="no-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl">
            {tab === 'home' && (
              <Home
                name={USER_NAME}
                categories={categories}
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onEditTask={openEditTask}
                onDeleteTask={setDeletingTask}
                onReorderTasks={(ids) => void reorderTasks(ids)}
                onManageCategories={() => setManageCategoriesOpen(true)}
                onAddTask={openAddTask}
              />
            )}
            {tab === 'calendar' && <Calendar tasks={tasks} />}
            {tab === 'analytics' && (
              <Analytics tasks={tasks} categories={categories} />
            )}
            {tab === 'profile' && <Profile name={USER_NAME} />}
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} onPomodoro={() => setPomodoroOpen(true)} />
      </div>

      {taskSheetOpen && (
        <TaskSheet
          key={editingTask?.id ?? 'new'}
          task={editingTask}
          categories={categories}
          onClose={() => setTaskSheetOpen(false)}
          onSubmit={handleSubmitTask}
        />
      )}

      {manageCategoriesOpen && (
        <ManageCategories
          categories={categories}
          onClose={() => setManageCategoriesOpen(false)}
          onAdd={handleAddCategory}
          onUpdate={handleUpdateCategory}
          onDelete={handleDeleteCategory}
          onReorder={handleReorderCategories}
        />
      )}

      <ConfirmDialog
        open={deletingTask !== null}
        title="Delete task"
        message={`Are you sure you want to delete "${deletingTask?.title ?? ''}"? This can't be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />

      <PomodoroTimer
        open={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
      />
    </div>
  )
}
