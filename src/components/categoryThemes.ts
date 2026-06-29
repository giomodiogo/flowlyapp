/**
 * Gradient presets offered when creating a category. The Tailwind classes are
 * written out in full so they survive the production purge.
 */
export interface CategoryTheme {
  id: string
  gradient: string
}

export const categoryThemes: CategoryTheme[] = [
  { id: 'pink', gradient: 'from-accent-pink to-accent-purple' },
  { id: 'blue', gradient: 'from-accent to-sky-400' },
  { id: 'purple', gradient: 'from-accent-purple to-accent-pink' },
  { id: 'green', gradient: 'from-emerald-400 to-teal-400' },
  { id: 'orange', gradient: 'from-orange-400 to-pink-500' },
]
