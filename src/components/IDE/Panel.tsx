import { X } from 'lucide-react'
import IconButton from '../UI/IconButton'
import Terminal from './Terminal'
import type { TerminalState } from '../../hooks/useTerminal'

export const PANEL_TABS = ['Problems', 'Output', 'Debug Console', 'Terminal', 'Ports'] as const
export type PanelTab = (typeof PANEL_TABS)[number]

const EMPTY_MESSAGES: Record<Exclude<PanelTab, 'Terminal'>, string> = {
  Problems: 'No problems have been detected in the workspace.',
  Output: 'Nothing to show yet.',
  'Debug Console': 'No active debugging session.',
  Ports: 'No forwarded ports.',
}

interface PanelProps {
  height: number
  active: PanelTab
  onActiveChange: (tab: PanelTab) => void
  terminal: TerminalState
  onLaunch: (href: string) => void
  onClose: () => void
}

export default function Panel({ height, active, onActiveChange, terminal, onLaunch, onClose }: PanelProps) {
  return (
    <section aria-label="Panel" style={{ height }} className="flex shrink-0 flex-col bg-terminal">
      <div className="flex h-9 shrink-0 items-center justify-between px-2">
        <div role="tablist" aria-label="Panel views" className="flex h-full items-center gap-1">
          {PANEL_TABS.map((tab) => (
            <button key={tab} type="button" role="tab"
              aria-selected={active === tab}
              onClick={() => onActiveChange(tab)}
              className={`rounded px-3 py-1 text-[13px] transition-colors ${
                active === tab ? 'bg-selection text-ink' : 'text-ink-faint hover:text-ink-dim'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <IconButton label="Close Panel" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </div>

      <div role="tabpanel" className="flex min-h-0 flex-1 flex-col">
        {active === 'Terminal' ? (
          <Terminal terminal={terminal} onLaunch={onLaunch} />
        ) : (
          <p className="p-3 font-mono text-sm text-ink-faint">{EMPTY_MESSAGES[active]}</p>
        )}
      </div>
    </section>
  )
}