import type { useExtensions } from '../../hooks/useExtensions'
import { ACTIVITIES, type ActivityId } from './activities'
import ExtensionsPanel from './ExtensionsPanel'
import FileExplorer from './FileExplorer'
import RunPanel from './RunPanel'
import SearchPanel from './SearchPanel'
import SourceControlPanel from './SourceControlPanel'

interface SideBarProps {
  activity: ActivityId
  width: number
  activePath: string | null
  onOpenFile: (path: string, pinned: boolean) => void
  extensions: ReturnType<typeof useExtensions>
  onLaunchCV: () => void
  onOpenTerminal: () => void
}

export default function SideBar({
  activity,
  width,
  activePath,
  onOpenFile,
  extensions,
  onLaunchCV,
  onOpenTerminal,
}: SideBarProps) {
  const title = ACTIVITIES.find((item) => item.id === activity)?.label ?? ''

  return (
    <aside aria-label={title} style={{ width }} className="flex shrink-0 flex-col bg-sidebar">
      <h2 className="flex h-9 shrink-0 items-center px-5 text-[13px] font-medium text-ink">
        {title}
      </h2>

      <div className={activity === 'explorer' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        <FileExplorer activePath={activePath} onOpen={onOpenFile} />
      </div>

      {activity === 'search' && <SearchPanel onOpen={onOpenFile} />}
      {activity === 'source-control' && <SourceControlPanel />}
      {activity === 'run' && <RunPanel onLaunchCV={onLaunchCV} onOpenTerminal={onOpenTerminal} />}
      {activity === 'extensions' && <ExtensionsPanel extensions={extensions} />}
    </aside>
  )
}