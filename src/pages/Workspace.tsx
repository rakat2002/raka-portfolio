import { useState } from 'react'
import ActivityBar from '../components/IDE/ActivityBar'
import type { ActivityId } from '../components/IDE/activities'
import EditorArea from '../components/IDE/EditorArea'
import Panel from '../components/IDE/Panel'
import Sash from '../components/IDE/Sash'
import SideBar from '../components/IDE/SideBar'
import StatusBar from '../components/IDE/StatusBar'
import WindowChrome from '../components/IDE/WindowChrome'
import { README_PATH, filesByPath } from '../data/portfolioFiles'
import { useCursors } from '../hooks/useCursors'
import { useEditorTabs } from '../hooks/useEditorTabs'
import { useKeybindings } from '../hooks/useKeybindings'
import { useResizable } from '../hooks/useResizable'
import { useTerminal } from '../hooks/useTerminal'

export default function Workspace() {
  const [activity, setActivity] = useState<ActivityId>('explorer')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const { tabs, activePath, openFile, closeTab, activateTab, pinTab } = useEditorTabs(README_PATH)
  const { cursor, setCursor } = useCursors(activePath)
  const terminal = useTerminal()

  const activeFile = activePath ? (filesByPath.get(activePath) ?? null) : null

  const sidebar = useResizable({ initial: 260, min: 180, max: 480, axis: 'x' })
  const panel = useResizable({ initial: 220, min: 100, max: 500, axis: 'y', invert: true })

  const toggleSidebar = () => setSidebarOpen((open) => !open)
  const togglePanel = () => setPanelOpen((open) => !open)

  useKeybindings({ b: toggleSidebar, '`': togglePanel })

  // Like VS Code: clicking the active icon hides the sidebar; another icon switches view.
  const selectActivity = (id: ActivityId) => {
    if (id === activity && sidebarOpen) {
      setSidebarOpen(false)
    } else {
      setActivity(id)
      setSidebarOpen(true)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface text-ink">
      <WindowChrome
        sidebarOpen={sidebarOpen}
        panelOpen={panelOpen}
        onToggleSidebar={toggleSidebar}
        onTogglePanel={togglePanel}
      />

      <div className="flex min-h-0 flex-1">
        <ActivityBar active={activity} sidebarOpen={sidebarOpen} onSelect={selectActivity} />

        {sidebarOpen && (
          <>
            <SideBar
              activity={activity}
              width={sidebar.size}
              activePath={activePath}
              onOpenFile={openFile}
            />
            <Sash orientation="vertical" label="Resize sidebar" handlers={sidebar.handlers} />
          </>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <EditorArea
            tabs={tabs}
            activePath={activePath}
            cursor={cursor}
            onSelectTab={activateTab}
            onCloseTab={closeTab}
            onPinTab={pinTab}
            onCursorChange={setCursor}
          />
          {panelOpen && (
            <>
              <Sash orientation="horizontal" label="Resize panel" handlers={panel.handlers} />
              <Panel height={panel.size} terminal={terminal} onClose={() => setPanelOpen(false)} />
            </>
          )}
        </div>
      </div>

      <StatusBar file={activeFile} cursor={cursor} />
    </div>
  )
}