import { useState } from 'react'
import { X } from 'lucide-react'
import IconButton from '../UI/IconButton'

const TABS = ['Problems', 'Output', 'Debug Console', 'Terminal', 'Ports'] as const
type PanelTab = (typeof TABS)[number]

interface PanelProps {
  height: number
  onClose: () => void
}

export default function Panel({ height, onClose }: PanelProps) {
  const [active, setActive] = useState<PanelTab>('Terminal')

  return (
    <section aria-label="Panel" style={{ height }} className="flex shrink-0 flex-col bg-terminal">
      <div className="flex h-9 shrink-0 items-center justify-between px-2">
        <div role="tablist" aria-label="Panel views" className="flex h-full items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              onClick={() => setActive(tab)}
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
      <div role="tabpanel" className="flex-1 overflow-auto p-3 font-mono text-sm text-ink-faint">
        {active} view arrives in a later step.
      </div>
    </section>
  )
}