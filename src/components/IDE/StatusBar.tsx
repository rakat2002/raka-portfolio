import { Bell, CircleX, GitBranch, TriangleAlert } from 'lucide-react'

export default function StatusBar() {
  return (
    <footer className="flex h-6 shrink-0 items-center justify-between bg-statusbar px-3 text-xs text-statusbar-ink">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <GitBranch size={13} aria-hidden="true" />
          main
        </span>
        <span className="flex items-center gap-1">
          <CircleX size={13} aria-hidden="true" /> 0
          <TriangleAlert size={13} aria-hidden="true" className="ml-2" /> 0
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Ln 1, Col 1</span>
        <span className="hidden sm:inline">Spaces: 2</span>
        <span className="hidden md:inline">UTF-8</span>
        <span className="hidden md:inline">TypeScript</span>
        <span className="flex items-center gap-1">
          Ready <Bell size={13} aria-hidden="true" />
        </span>
      </div>
    </footer>
  )
}