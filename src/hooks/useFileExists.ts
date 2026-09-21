import { useEffect, useState } from 'react'

/**
 * True only when the file exists AND has the expected type.
 * The type check matters: for a missing file, a website often replies with its home page
 * instead of an error, and that must not count as "the file exists".
 */
export function useFileExists(path: string, typeContains: string): boolean {
  const [exists, setExists] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(path, { method: 'HEAD' })
      .then((response) => {
        const type = response.headers.get('content-type') ?? ''
        if (!cancelled) setExists(response.ok && type.includes(typeContains))
      })
      .catch(() => {
        if (!cancelled) setExists(false)
      })

    return () => {
      cancelled = true
    }
  }, [path, typeContains])

  return exists
}