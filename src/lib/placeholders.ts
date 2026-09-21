const PLACEHOLDER_PREFIX = 'TODO'

export const isPlaceholder = (text: string): boolean =>
  text.trimStart().startsWith(PLACEHOLDER_PREFIX)

/** Returns the text, or undefined when it is empty or still a TODO placeholder. */
export const visible = (text: string): string | undefined =>
  text.trim() === '' || isPlaceholder(text) ? undefined : text

/** Keeps only the real entries of a list. */
export const clean = (items: string[]): string[] =>
  items.filter((item) => item.trim() !== '' && !isPlaceholder(item))

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