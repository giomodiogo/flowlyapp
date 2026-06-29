import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

interface HasId {
  id: string
}

interface Sortable<T> {
  /** The list to render — reflects the live order while dragging. */
  list: T[]
  /** Id of the item currently being dragged, or null. */
  dragId: string | null
  /** Pointer-down handler to attach to a drag handle. */
  start: (event: ReactPointerEvent, id: string) => void
}

/**
 * Pointer-based drag-to-reorder for a list of items with an `id`.
 *
 * Works with both mouse and touch (used inside a Capacitor webview). Each
 * sortable row must expose its id via the `data-sort-id` attribute so the
 * drag logic can find the item under the pointer.
 */
export function useSortable<T extends HasId>(
  items: T[],
  onCommit: (orderedIds: string[]) => void,
): Sortable<T> {
  const [dragItems, setDragItems] = useState<T[] | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const liveRef = useRef<T[] | null>(null)

  const start = (event: ReactPointerEvent, id: string) => {
    event.preventDefault()
    const initial = [...items]
    liveRef.current = initial
    setDragItems(initial)
    setDragId(id)

    const onMove = (ev: PointerEvent) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY)
      const row = el?.closest('[data-sort-id]') as HTMLElement | null
      const targetId = row?.getAttribute('data-sort-id')
      const current = liveRef.current
      if (!targetId || targetId === id || !current) return

      const from = current.findIndex((item) => item.id === id)
      const to = current.findIndex((item) => item.id === targetId)
      if (from === -1 || to === -1 || from === to) return

      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      liveRef.current = next
      setDragItems(next)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const final = liveRef.current
      if (final) {
        const orderedIds = final.map((item) => item.id)
        const changed = orderedIds.some((cid, i) => items[i]?.id !== cid)
        if (changed) onCommit(orderedIds)
      }
      liveRef.current = null
      setDragItems(null)
      setDragId(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return { list: dragItems ?? items, dragId, start }
}
