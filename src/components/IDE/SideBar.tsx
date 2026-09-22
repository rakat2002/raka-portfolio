import { ACTIVITIES, type ActivityId } from './activities'
import ExtensionsPanel from './ExtensionsPanel'
import FileExplorer from './FileExplorer'
import type { useExtensions } from '../../hooks/useExtensions'

interface SideBarProps {
  activity: ActivityId
  width: number
  activePath: string | null
  onOpenFile: (path: string, pinned: boolean) => void
  extensions: ReturnType<typeof useExtensions>
}

export default function SideBar({ activity, width, activePath, onOpenFile, extensions }: SideBarProps) {
  const title = ACTIVITIES.find((item) => item.id === activity)?.label ?? ''
  const showExplorer = activity === 'explorer'
  const showExtensions = activity === 'extensions'

  return (
    <aside aria-label={title} style={{ width }} className="flex shrink-0 flex-col bg-sidebar">
      <h2 className="flex h-9 shrink-0 items-center px-5 text-[13px] font-medium text-ink">
        {title}
      </h2>

      <div className={showExplorer ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <FileExplorer activePath={activePath} onOpen={onOpenFile} />
      </div>

      {showExtensions && <ExtensionsPanel extensions={extensions} />}

      {!showExplorer && !showExtensions && (
        <div className="flex-1 overflow-auto px-5 py-2 text-sm text-ink-faint">
          The {title} view arrives in a later step.
        </div>
      )}
    </aside>
  )
}