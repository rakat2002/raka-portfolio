import { useEffect, useState } from 'react'

const STORAGE_KEY = 'raka-portfolio:extensions'

interface StoredState {
  installed: string[]
  activeThemeId: string | null
}

function readStorage(): StoredState {
  if (typeof window === 'undefined') return { installed: [], activeThemeId: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { installed: [], activeThemeId: null }
    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      installed: Array.isArray(parsed.installed) ? parsed.installed : [],
      activeThemeId: typeof parsed.activeThemeId === 'string' ? parsed.activeThemeId : null,
    }
  } catch {
    return { installed: [], activeThemeId: null }
  }
}

export function useExtensions() {
  const [installed, setInstalled] = useState<Set<string>>(() => new Set(readStorage().installed))
  const [activeThemeId, setActiveThemeIdState] = useState<string | null>(
    () => readStorage().activeThemeId,
  )

  // Save to this browser only, so the choice is remembered on the next visit.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ installed: [...installed], activeThemeId }),
      )
    } catch {
      // Private browsing or storage disabled: the site still works, it just won't remember.
    }
  }, [installed, activeThemeId])

  const install = (id: string) => setInstalled((current) => new Set(current).add(id))

  const uninstall = (id: string) => {
    setInstalled((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
    // If the theme being removed was active, fall back to the default look.
    setActiveThemeIdState((current) => (current === id ? null : current))
  }

  return {
    isInstalled: (id: string) => installed.has(id),
    install,
    uninstall,
    activeThemeId,
    setActiveThemeId: setActiveThemeIdState,
  }
}