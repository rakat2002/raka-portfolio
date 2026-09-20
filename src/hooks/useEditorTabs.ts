import { useState } from 'react'

export interface EditorTab {
  path: string
  pinned: boolean
}

export function useEditorTabs(initialPath: string | null) {
  const [tabs, setTabs] = useState<EditorTab[]>(
    initialPath ? [{ path: initialPath, pinned: true }] : [],
  )
  const [activePath, setActivePath] = useState<string | null>(initialPath)

  const pinTab = (path: string) => {
    setTabs((current) => current.map((tab) => (tab.path === path ? { ...tab, pinned: true } : tab)))
  }

  const openFile = (path: string, pinned: boolean) => {
    setTabs((current) => {
      const existing = current.find((tab) => tab.path === path)

      // Already open: a double click turns a preview tab into a pinned one.
      if (existing) {
        return pinned && !existing.pinned
          ? current.map((tab) => (tab.path === path ? { ...tab, pinned: true } : tab))
          : current
      }

      // A new preview tab replaces the current preview tab, if there is one.
      if (!pinned) {
        const previewIndex = current.findIndex((tab) => !tab.pinned)
        if (previewIndex !== -1) {
          const next = [...current]
          next[previewIndex] = { path, pinned: false }
          return next
        }
      }

      return [...current, { path, pinned }]
    })
    setActivePath(path)
  }

  const closeTab = (path: string) => {
    const index = tabs.findIndex((tab) => tab.path === path)
    if (index === -1) return
    const remaining = tabs.filter((tab) => tab.path !== path)
    setTabs(remaining)
    if (path === activePath) {
      setActivePath(remaining[Math.min(index, remaining.length - 1)]?.path ?? null)
    }
  }

  return { tabs, activePath, openFile, closeTab, activateTab: setActivePath, pinTab }
}