import { ACTIVITIES, type ActivityId } from './activities'
import FileExplorer from './FileExplorer'

interface SideBarProps {
  activity: ActivityId
  width: number
  activePath: string | null
  onOpenFile: (path: string, pinned: boolean) => void
}

export default function SideBar({ activity, width, activePath, onOpenFile }: SideBarProps) {
  const title = ACTIVITIES.find((item) => item.id === activity)?.label ?? ''
  const showExplorer = activity === 'explorer'

  return (
    <aside aria-label={title} style={{ width }} className="flex shrink-0 flex-col bg-sidebar">
      <h2 className="flex h-9 shrink-0 items-center px-5 text-[13px] font-medium text-ink">
        {title}
      </h2>

      <div className={showExplorer ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <FileExplorer activePath={activePath} onOpen={onOpenFile} />
      </div>

      {!showExplorer && (
        <div className="flex-1 overflow-auto px-5 py-2 text-sm text-ink-faint">
          The {title} view arrives in a later step.
        </div>
      )}
    </aside>
  )
}