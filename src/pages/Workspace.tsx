import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActivityBar from '../components/IDE/ActivityBar'
import type { ActivityId } from '../components/IDE/activities'
import EditorArea from '../components/IDE/EditorArea'
import LaunchOverlay from '../components/IDE/LaunchOverlay'
import type { MenuDef } from '../components/IDE/MenuBar'
import Panel, { type PanelTab } from '../components/IDE/Panel'
import Sash from '../components/IDE/Sash'
import SideBar from '../components/IDE/SideBar'
import StatusBar from '../components/IDE/StatusBar'
import WindowChrome from '../components/IDE/WindowChrome'
import { profile } from '../data/profile'
import { README_PATH, filesByPath } from '../data/portfolioFiles'
import { useCursors } from '../hooks/useCursors'
import { useEditorTabs } from '../hooks/useEditorTabs'
import { useExtensions } from '../hooks/useExtensions'
import { useKeybindings } from '../hooks/useKeybindings'
import { useResizable } from '../hooks/useResizable'
import { useTerminal } from '../hooks/useTerminal'
import { CV_PATH, prefersReducedMotion } from '../lib/browser'
import { EXTENSIONS } from '../lib/extensions'
import { visible } from '../lib/placeholders'
import { getRunConfig, runnableProjects } from '../lib/runConfigs'

const LAUNCH_DELAY_MS = 650

export default function Workspace() {
  const navigate = useNavigate()
  const [activity, setActivity] = useState<ActivityId>('explorer')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const [panelTab, setPanelTab] = useState<PanelTab>('Terminal')
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

  // Opens the panel and switches it to the Terminal tab, used when a project is run.
  const showTerminal = () => {
    setPanelOpen(true)
    setPanelTab('Terminal')
  }

  const runProject = (name: string, technologies: string[]) => {
    const config = getRunConfig(name, technologies)
    showTerminal()
    terminal.runProgram(config.command, config.lines)
  }

  const menus: MenuDef[] = [
    {
      id: 'file',
      label: 'File',
      actions: [
        { label: 'Open README.md', onSelect: () => openFile(README_PATH, true) },
        { label: 'Open about/me.ts', onSelect: () => openFile('about/me.ts', true) },
        { label: 'View CV', onSelect: () => setLaunchTarget(CV_PATH) },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      actions: [{ label: 'Files are read-only in this workspace', disabled: true }],
    },
    {
      id: 'selection',
      label: 'Selection',
      actions: [{ label: 'No selection actions available', disabled: true }],
    },
    {
      id: 'view',
      label: 'View',
      actions: [
        { label: sidebarOpen ? 'Hide Sidebar (Ctrl+B)' : 'Show Sidebar (Ctrl+B)', onSelect: toggleSidebar },
        { label: panelOpen ? 'Hide Panel (Ctrl+`)' : 'Show Panel (Ctrl+`)', onSelect: togglePanel },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      actions: [
        { label: 'Go to README.md', onSelect: () => openFile(README_PATH, true) },
        { label: 'Go to About', onSelect: () => openFile('about/me.ts', true) },
        { label: 'Go to Skills', onSelect: () => openFile('skills/technical.ts', true) },
        { label: 'Go to Contact', onSelect: () => openFile('contact/contact.ts', true) },
      ],
    },
    {
      id: 'run',
      label: 'Run',
      actions: [
        ...runnableProjects().map((project) => ({
          label: `Run ${project.name}`,
          onSelect: () => runProject(project.name, project.technologies),
        })),
        { label: 'Launch CV', onSelect: () => setLaunchTarget(CV_PATH) },
      ],
    },
    {
      id: 'terminal',
      label: 'Terminal',
      actions: [
        { label: 'Focus Terminal', onSelect: showTerminal },
        { label: 'Clear Terminal', onSelect: terminal.clear },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      actions: [
        ...(visible(profile.github) ? [{ label: 'View on GitHub', href: profile.github }] : []),
        ...(visible(profile.linkedin) ? [{ label: 'View on LinkedIn', href: profile.linkedin }] : []),
      ],
    },
  ]

  return (
    <div
      data-theme={activeThemeDef?.themeDataValue}
      className="flex h-full flex-col overflow-hidden bg-surface text-ink"
    >
      <WindowChrome
        sidebarOpen={sidebarOpen}
        panelOpen={panelOpen}
        menus={menus}
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
              terminal={terminal}
              onLaunchCV={() => setLaunchTarget(CV_PATH)}
              onRunProgram={showTerminal}
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
              <Panel
                height={panel.size}
                active={panelTab}
                onActiveChange={setPanelTab}
                terminal={terminal}
                onLaunch={setLaunchTarget}
                onClose={() => setPanelOpen(false)}
              />
            </>
          )}
        </div>
      </div>

      <StatusBar file={activeFile} cursor={cursor} />

      {launchTarget && <LaunchOverlay />}
    </div>
  )
}