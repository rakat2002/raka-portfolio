import { useState } from 'react'

export interface Cursor {
  line: number // 1-based, like the numbers in the gutter
  col: number // 0-based: 0 means "before the first character"
}

export const START: Cursor = { line: 1, col: 0 }

export function useCursors(activePath: string | null) {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({})

  const cursor = (activePath ? cursors[activePath] : undefined) ?? START

  const setCursor = (next: Cursor) => {
    if (!activePath) return
    setCursors((current) => ({ ...current, [activePath]: next }))
  }

  return { cursor, setCursor }
}