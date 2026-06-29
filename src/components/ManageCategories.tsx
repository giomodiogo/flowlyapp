import { useState } from 'react'
import { ArrowLeft, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { CategorySheet, type CategoryFormInput } from './CategorySheet'
import { ConfirmDialog } from './ConfirmDialog'
import { useSortable } from './useSortable'
import type { Category } from '../types'

interface ManageCategoriesProps {
  categories: Category[]
  onClose: () => void
  onAdd: (input: CategoryFormInput) => void
  onUpdate: (id: string, patch: CategoryFormInput) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function ManageCategories({
  categories,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: ManageCategoriesProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const { list, dragId, start: startDrag } = useSortable(categories, onReorder)

  const openAdd = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setSheetOpen(true)
  }

  const handleSubmit = (input: CategoryFormInput) => {
    if (editing) {
      onUpdate(editing.id, input)
    } else {
      onAdd(input)
    }
  }

  const confirmDelete = () => {
    if (deleting) onDelete(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      <header className="flex items-center gap-3 px-5 pt-6 lg:px-10 lg:pt-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="-ml-1 grid h-10 w-10 place-items-center rounded-xl text-ink transition active:scale-95"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.4} />
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight">Manage categories</h1>
      </header>

      <div className="no-scrollbar mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-5 pb-28 pt-6 lg:px-10">
        {list.length > 1 && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Drag to reorder
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {list.map((category) => (
            <li
              key={category.id}
              data-sort-id={category.id}
              className={`flex items-center gap-3 rounded-3xl bg-white px-3 py-4 shadow-card transition ${
                dragId === category.id ? 'scale-[1.02] ring-2 ring-accent' : ''
              }`}
            >
              <button
                type="button"
                onPointerDown={(e) => startDrag(e, category.id)}
                aria-label={`Reorder ${category.name}`}
                className="grid h-9 w-7 shrink-0 cursor-grab touch-none place-items-center text-muted active:cursor-grabbing"
              >
                <GripVertical className="h-5 w-5" strokeWidth={2.2} />
              </button>

              <span
                className={`h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br ${category.gradient}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-bold text-ink">
                  {category.name}
                </p>
                <p className="text-xs font-medium text-muted">
                  {category.taskCount} task{category.taskCount === 1 ? '' : 's'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openEdit(category)}
                aria-label={`Edit ${category.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-muted transition active:scale-95 hover:text-ink"
              >
                <Pencil className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => setDeleting(category)}
                aria-label={`Delete ${category.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas text-muted transition active:scale-95 hover:text-accent-pink"
              >
                <Trash2 className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </button>
            </li>
          ))}

          {list.length === 0 && (
            <li className="rounded-3xl bg-white px-5 py-10 text-center text-sm font-medium text-muted shadow-card">
              No categories yet. Add your first one.
            </li>
          )}
        </ul>
      </div>

      <div className="border-t border-slate-200/70 bg-white px-5 py-4 lg:px-10">
        <div className="mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" strokeWidth={2.6} />
            Add category
          </button>
        </div>
      </div>

      {sheetOpen && (
        <CategorySheet
          key={editing?.id ?? 'new'}
          category={editing}
          onClose={() => setSheetOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete category"
        message={`Delete "${deleting?.name ?? ''}"? Tasks in this category won't be deleted — they'll just become uncategorised.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
