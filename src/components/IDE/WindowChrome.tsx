import { PanelBottom, PanelLeft, Search } from 'lucide-react'
import IconButton from '../UI/IconButton'

const MENUS = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help']

interface WindowChromeProps {
  sidebarOpen: boolean
  panelOpen: boolean
  onToggleSidebar: () => void
  onTogglePanel: () => void
}

export default function WindowChrome({
  sidebarOpen,
  panelOpen,
  onToggleSidebar,
  onTogglePanel,
}: WindowChromeProps) {
  return (
    <header className="grid h-9 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-titlebar px-2 text-xs text-titlebar-ink">
      <div className="flex items-center">
        <span
          aria-hidden="true"
          className="mr-2 grid h-5 w-5 place-items-center rounded bg-accent font-mono text-[11px] font-bold text-white"
        >
          R
        </span>
        <nav aria-label="Application menu" className="hidden items-center md:flex">
          {MENUS.map((menu) => (
            <button
              key={menu}
              type="button"
              className="rounded px-2 py-1 transition-colors hover:bg-highlight"
            >
              {menu}
            </button>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="flex h-6 w-[min(30rem,40vw)] items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 transition-colors hover:bg-white/10"
      >
        <Search size={13} aria-hidden="true" />
        raka.dev
      </button>

      <div className="flex items-center justify-end gap-1">
        <IconButton
          label="Toggle Primary Sidebar (Ctrl+B)"
          aria-pressed={sidebarOpen}
          onClick={onToggleSidebar}
        >
          <PanelLeft size={16} />
        </IconButton>
        <IconButton
          label="Toggle Panel (Ctrl+`)"
          aria-pressed={panelOpen}
          onClick={onTogglePanel}
        >
          <PanelBottom size={16} />
        </IconButton>
      </div>
    </header>
  )
}