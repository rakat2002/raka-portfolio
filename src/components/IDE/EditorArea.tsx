import type { FileNode } from '../../data/portfolioFiles'

const SHORTCUTS = [
  { action: 'Toggle Sidebar', keys: 'Ctrl+B' },
  { action: 'Toggle Terminal', keys: 'Ctrl+`' },
]

interface EditorAreaProps {
  file: FileNode | null
}

export default function EditorArea({ file }: EditorAreaProps) {
  if (!file) {
    return (
      <main className="grid min-h-0 flex-1 place-items-center bg-editor">
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
      </main>
    )
  }

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-editor p-4">
      <pre className="font-mono text-[13px] leading-[22px] text-syn-default">{file.content}</pre>
    </main>
  )
}