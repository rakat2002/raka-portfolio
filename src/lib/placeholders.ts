const PLACEHOLDER_PREFIX = 'TODO'

export const isPlaceholder = (text: string): boolean =>
  text.trimStart().startsWith(PLACEHOLDER_PREFIX)

/** Counts how many text values in a piece of data are still "TODO" placeholders. */
export function countPlaceholders(value: unknown): number {
  if (typeof value === 'string') return isPlaceholder(value) ? 1 : 0
  if (Array.isArray(value)) {
    return value.reduce<number>((sum, item) => sum + countPlaceholders(item), 0)
  }
  if (value && typeof value === 'object') {
    return Object.values(value).reduce<number>((sum, item) => sum + countPlaceholders(item), 0)
  }
  return 0
}