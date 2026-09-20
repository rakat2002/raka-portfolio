import { filesByPath } from '../../data/portfolioFiles'
import type { EditorTab } from '../../hooks/useEditorTabs'
import CodeView from './CodeView'
import EditorTabs from './EditorTabs'

const SHORTCUTS = [
  { action: 'Toggle Sidebar', keys: 'Ctrl+B' },
  { action: 'Toggle Terminal', keys: 'Ctrl+`' },
]

function EmptyEditor() {
  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="w-72">
        <p className="mb-4 text-center font-mono text-sm tracking-widest text-ink-faint">
          RAKA.DEV
        </p>
        <ul className="space-y-2 text-sm text-ink-dim">
          {SHORTCUTS.map(({ action, keys }) => (
            <li key={action} className="flex items-center justify-between">
              <span>{action}</span>
              <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[11px]">
                {keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface EditorAreaProps {
  tabs: EditorTab[]
  activePath: string | null
  onSelectTab: (path: string) => void
  onCloseTab: (path: string) => void
  onPinTab: (path: string) => void
}

export default function EditorArea({
  tabs,
  activePath,
  onSelectTab,
  onCloseTab,
  onPinTab,
}: EditorAreaProps) {
  const file = activePath ? filesByPath.get(activePath) : undefined

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-editor">
      {tabs.length > 0 && (
        <EditorTabs
          tabs={tabs}
          activePath={activePath}
          onSelect={onSelectTab}
          onClose={onCloseTab}
          onPin={onPinTab}
        />
      )}
      {file ? <CodeView key={file.path} file={file} /> : <EmptyEditor />}
    </main>
  )
}