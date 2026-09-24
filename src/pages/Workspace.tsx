import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActivityBar from '../components/IDE/ActivityBar'
import type { ActivityId } from '../components/IDE/activities'
import EditorArea from '../components/IDE/EditorArea'
import LaunchOverlay from '../components/IDE/LaunchOverlay'
import Panel from '../components/IDE/Panel'
import Sash from '../components/IDE/Sash'
import SideBar from '../components/IDE/SideBar'
import StatusBar from '../components/IDE/StatusBar'
import WindowChrome from '../components/IDE/WindowChrome'
import { README_PATH, filesByPath } from '../data/portfolioFiles'
import { useCursors } from '../hooks/useCursors'
import { useEditorTabs } from '../hooks/useEditorTabs'
import { useExtensions } from '../hooks/useExtensions'
import { useKeybindings } from '../hooks/useKeybindings'
import { useResizable } from '../hooks/useResizable'
import { useTerminal } from '../hooks/useTerminal'
import { CV_PATH, prefersReducedMotion } from '../lib/browser'
import { EXTENSIONS } from '../lib/extensions'

const LAUNCH_DELAY_MS = 650

export default function Workspace() {
  const navigate = useNavigate()
  const [activity, setActivity] = useState<ActivityId>('explorer')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const [launchTarget, setLaunchTarget] = useState<string | null>(null)
  const { tabs, activePath, openFile, closeTab, activateTab, pinTab } = useEditorTabs(README_PATH)
  const { cursor, setCursor } = useCursors(activePath)
  const terminal = useTerminal()
  const extensions = useExtensions()

  const activeFile = activePath ? (filesByPath.get(activePath) ?? null) : null
  const activeThemeDef = EXTENSIONS.find((ext) => ext.id === extensions.activeThemeId)

  const sidebar = useResizable({ initial: 260, min: 180, max: 480, axis: 'x' })
  const panel = useResizable({ initial: 220, min: 100, max: 500, axis: 'y', invert: true })

  const toggleSidebar = () => setSidebarOpen((open) => !open)
  const togglePanel = () => setPanelOpen((open) => !open)

  useKeybindings({ b: toggleSidebar, '`': togglePanel })

  useEffect(() => {
    if (!launchTarget) return
    const timer = window.setTimeout(
      () => navigate(launchTarget),
      prefersReducedMotion() ? 0 : LAUNCH_DELAY_MS,
    )
    return () => window.clearTimeout(timer)
  }, [launchTarget, navigate])

  const selectActivity = (id: ActivityId) => {
    if (id === activity && sidebarOpen) {
      setSidebarOpen(false)
    } else {
      setActivity(id)
      setSidebarOpen(true)
    }
  }

  const openTerminal = () => setPanelOpen(true)

  return (
    <div
      data-theme={activeThemeDef?.themeDataValue}
      className="flex h-full flex-col overflow-hidden bg-surface text-ink"
    >
      <WindowChrome
        sidebarOpen={sidebarOpen}
        panelOpen={panelOpen}
        onToggleSidebar={toggleSidebar}
        onTogglePanel={togglePanel}
        onLaunchCV={() => setLaunchTarget(CV_PATH)}
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
              extensions={extensions}
              onLaunchCV={() => setLaunchTarget(CV_PATH)}
              onOpenTerminal={openTerminal}
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
              <Panel height={panel.size} terminal={terminal} onLaunch={setLaunchTarget} onClose={() => setPanelOpen(false)} />
            </>
          )}
        </div>
      </div>

      <StatusBar file={activeFile} cursor={cursor} />

      {launchTarget && <LaunchOverlay />}
    </div>
  )
}