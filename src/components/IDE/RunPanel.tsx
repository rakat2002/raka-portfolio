import { FileText, Terminal as TerminalIcon } from 'lucide-react'
import { CV_PATH } from '../../lib/browser'

interface RunPanelProps {
  onLaunchCV: () => void
  onOpenTerminal: () => void
}

export default function RunPanel({ onLaunchCV, onOpenTerminal }: RunPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3 text-[13px]">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Portfolio</p>

      <button
        type="button"
        onClick={onLaunchCV}
        className="flex items-center gap-2 rounded border border-line bg-editor px-3 py-2 text-left text-ink transition-colors hover:bg-highlight"
      >
        <FileText size={14} className="text-accent" aria-hidden="true" />
        <span>
          <span className="block font-medium">Launch CV</span>
          <span className="block text-[11px] text-ink-faint">
            Opens {CV_PATH} in the professional view
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenTerminal}
        className="flex items-center gap-2 rounded border border-line bg-editor px-3 py-2 text-left text-ink transition-colors hover:bg-highlight"
      >
        <TerminalIcon size={14} className="text-accent" aria-hidden="true" />
        <span>
          <span className="block font-medium">Open Terminal</span>
          <span className="block text-[11px] text-ink-faint">Try `help` to see commands</span>
        </span>
      </button>

      <p className="mt-1 text-[12px] text-ink-faint">No active debugging session.</p>
    </div>
  )
}