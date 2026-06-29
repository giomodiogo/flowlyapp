import { Capacitor } from '@capacitor/core'
import type { PersistenceAdapter } from './adapter'
import { SqliteAdapter } from './sqlite/sqliteAdapter'
import { ApiAdapter } from './api/apiAdapter'
import { LocalStorageAdapter } from './memory/localStorageAdapter'

/**
 * Picks the right persistence backend for the current platform:
 *
 *  - native (iOS / Android) → local SQLite database (offline-first)
 *  - web with `VITE_API_URL` → remote HTTP API
 *  - web without an API URL  → `localStorage` fallback (dev convenience)
 *
 * The selection happens once here; the rest of the app only sees a
 * `PersistenceAdapter`.
 */
export function createPersistence(): PersistenceAdapter {
  if (Capacitor.isNativePlatform()) {
    return new SqliteAdapter()
  }

  const baseUrl = import.meta.env.VITE_API_URL
  if (baseUrl) {
    return new ApiAdapter({ baseUrl })
  }

  if (import.meta.env.DEV) {
    console.warn(
      '[persistence] VITE_API_URL is not set — falling back to localStorage. ' +
        'Configure VITE_API_URL to use the remote API on the web.',
    )
  }
  return new LocalStorageAdapter()
}

/** Shared singleton so the whole app talks to one backend instance. */
export const persistence: PersistenceAdapter = createPersistence()
