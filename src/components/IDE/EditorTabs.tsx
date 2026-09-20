import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { filesByPath } from '../../data/portfolioFiles'
import type { EditorTab } from '../../hooks/useEditorTabs'
import FileIcon from './FileIcon'

interface EditorTabsProps {
  tabs: EditorTab[]
  activePath: string | null
  onSelect: (path: string) => void
  onClose: (path: string) => void
  onPin: (path: string) => void
}

export default function EditorTabs({ tabs, activePath, onSelect, onClose, onPin }: EditorTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Keep the active tab visible when there are more tabs than fit.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activePath])

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Open editors"
      className="flex h-9 shrink-0 overflow-x-auto bg-tabs"
    >
      {tabs.map((tab) => {
        const file = filesByPath.get(tab.path)
        if (!file) return null
        const active = tab.path === activePath

        return (
          <div
            key={tab.path}
            role="presentation"
            data-active={active}
            className={`group relative flex shrink-0 items-center border-r border-line ${
              active ? 'bg-tab-active text-white' : 'bg-tab-inactive text-ink-dim hover:text-white'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(tab.path)}
              onDoubleClick={() => onPin(tab.path)}
              onMouseDown={(event) => {
                if (event.button === 1) event.preventDefault()
              }}
              onAuxClick={(event) => {
                if (event.button === 1) onClose(tab.path)
              }}
              className="flex h-full items-center gap-1.5 pl-3 pr-1 text-[13px]"
            >
              <FileIcon language={file.language} />
              <span className={tab.pinned ? '' : 'italic'}>{file.name}</span>
            </button>
            <button
              type="button"
              aria-label={`Close ${file.name}`}
              title={`Close ${file.name}`}
              onClick={() => onClose(tab.path)}
              className={`mx-1 grid h-5 w-5 place-items-center rounded transition-opacity hover:bg-highlight ${
                active ? '' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100'
              }`}
            >
              <X size={14} />
            </button>
            {active && (
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
            )}
          </div>
        )
      })}
    </div>
  )
}